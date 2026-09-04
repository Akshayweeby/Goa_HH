"""End-to-end Hacker House Goa Task 3 pipeline.

This file orchestrates the existing Stage 1, Stage 2, and Stage 3 modules;
it does not duplicate detection, discovery, matching, hashing, or blockchain
logic.
"""

from __future__ import annotations

import os
import tempfile
from pathlib import Path
from typing import Any

import cv2
from dotenv import load_dotenv

from face_detection.detector import FaceDetector
from social_search.search_engine import SocialMediaSearchEngine
from blockchain.upload_to_chain import BlockchainUploader
from blockchain.verify_from_chain import BlockchainVerifier


def _failed_pipeline(stage: str, message: str, **details: Any) -> dict[str, Any]:
    return {"success": False, "failed_stage": stage, "error": message, **details}


def run_pipeline(
    image_path: str | Path,
    public_image_url: str | None = None,
    *,
    detector: FaceDetector | None = None,
    search_engine: SocialMediaSearchEngine | None = None,
    uploader: BlockchainUploader | None = None,
    verifier: BlockchainVerifier | None = None,
) -> dict[str, Any]:
    """Run image → face → web match → blockchain verification.

    ``public_image_url`` is optional and is used by Google Lens providers.
    Bing can discover directly from ``image_path``. The optional dependency
    arguments make the flow easy to test without external services.
    """
    load_dotenv()

    detector = detector or FaceDetector()
    face_result = detector.detect_and_encode(image_path)
    if not face_result.get("success"):
        return _failed_pipeline("face_detection", face_result.get("error", "Face detection failed"), face=face_result)

    search_engine = search_engine or SocialMediaSearchEngine(face_detector=detector)
    image = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
    people = []
    source_faces = face_result.get("faces") or [{
        **face_result["bounding_box"], "embedding": face_result["embedding"]
    }]
    for index, face in enumerate(source_faces, start=1):
        crop_path = None
        try:
            x, y = face["x"], face["y"]
            query_path = image_path
            if image is not None:
                crop = image[y:y + face["height"], x:x + face["width"]]
                with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as handle:
                    crop_path = Path(handle.name)
                cv2.imwrite(str(crop_path), crop)
                query_path = crop_path
            search_result = search_engine.find_posts(
                image_path=query_path,
                image_url=public_image_url if len(source_faces) == 1 else None,
                face_embedding=face["embedding"],
            )
        finally:
            if crop_path:
                crop_path.unlink(missing_ok=True)

        person = {"face_number": index, "bounding_box": {
            key: face[key] for key in ("x", "y", "width", "height")
        }, "search": search_result, "name": "Not found", "social_media_handle": "Not found",
                  "post_url": None, "match_confidence": 0.0}
        if search_result.get("matches"):
            best_match = search_result["matches"][0]
            user = best_match.get("user") or {}
            person.update({
                "name": user.get("name") or "Not found",
                "social_media_handle": user.get("handle") or "Not found",
                "post_url": best_match.get("url"),
                "match_confidence": best_match.get("match_confidence", 0.0),
                "best_match": best_match,
            })
            if uploader is None:
                uploader = BlockchainUploader(rpc_url=os.getenv("RPC_URL"), private_key=os.getenv("PRIVATE_KEY"),
                                               contract_address=os.getenv("CONTRACT_ADDRESS"))
            upload_result = uploader.upload_post(best_match)
            person["blockchain_upload"] = upload_result
            if upload_result.get("success") and upload_result.get("post_id") is not None:
                if verifier is None:
                    verifier = BlockchainVerifier(rpc_url=os.getenv("RPC_URL"), private_key=os.getenv("PRIVATE_KEY"),
                                                  contract_address=upload_result.get("contract_address") or os.getenv("CONTRACT_ADDRESS"))
                person["blockchain_verification"] = verifier.verify_post(best_match, upload_result["post_id"])
        people.append(person)

    successful_matches = [person for person in people if person.get("best_match")]
    result = {
        "success": bool(successful_matches and all(person.get("blockchain_verification", {}).get("verified", False)
                                                    for person in successful_matches)),
        "face": face_result,
        "people": people,
    }
    if len(successful_matches) == 1:
        person = successful_matches[0]
        result.update({"best_match": person["best_match"],
                       "search": person["search"],
                       "blockchain_upload": person.get("blockchain_upload"),
                       "blockchain_verification": person.get("blockchain_verification")})
    if not successful_matches:
        result.update({"failed_stage": "social_search", "error": "No verified social/web match found"})
    elif not result["success"]:
        result.update({"failed_stage": "blockchain_verification", "error": "One or more matched posts were not verified on-chain"})
    return result


# Name used by the project plan and convenient for CLI callers.
run_full_pipeline = run_pipeline


def print_terminal_result(result: dict[str, Any]) -> None:
    """Print the useful human-readable fields without hiding the JSON result."""
    if result.get("face"):
        face = result["face"]
        print(f"Face detected: {face.get('faces_detected', 0)}")
        print(f"Face confidence: {face.get('confidence', 0):.4f}")
        print(f"Bounding box: {face.get('bounding_box')}")
        print(f"Embedding dimension: {face.get('embedding_dimension')}")
    for person in result.get("people", []):
        print(f"\nPerson {person['face_number']}")
        print(f"  Name: {person['name']}")
        print(f"  Social media handle: {person['social_media_handle']}")
        print(f"  Post: {person['post_url'] or 'Not found'}")
        print(f"  Match confidence: {person['match_confidence']:.4f}")
        if person.get("blockchain_verification"):
            print(f"  Blockchain verified: {person['blockchain_verification'].get('verified', False)}")
    if not result.get("success"):
        print(f"Pipeline stopped at {result.get('failed_stage')}: {result.get('error')}")
    print("\nFull result JSON:")
    import json
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    import argparse
    import json

    parser = argparse.ArgumentParser(description="Run the Goa face-to-blockchain pipeline")
    parser.add_argument("image_path", nargs="?", default=None, help="Input JPG/PNG image")
    parser.add_argument("--interactive", action="store_true", help="Prompt for Search <image-name>")
    parser.add_argument("--public-image-url", help="Public image URL for Google Lens")
    args = parser.parse_args()
    if args.interactive or not args.image_path:
        command = input("Type 'Search <image-name>' or 'Exit': ").strip()
        parts = command.split(maxsplit=1)
        if not parts or parts[0].lower() == "exit":
            raise SystemExit(0)
        if parts[0].lower() != "search" or len(parts) != 2:
            raise SystemExit("Use: Search images.jpg")
        args.image_path = str(Path("Images") / parts[1])
    print_terminal_result(run_pipeline(args.image_path, args.public_image_url))
