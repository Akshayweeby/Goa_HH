import hashlib

TITLE_RULES = {
    "frontend": ["Pixel Whisperer", "DOM Sculptor", "Component Composer", "State Architect"],
    "backend": ["API Craftsman", "Database Whisperer", "Server Sentinel", "Request Router"],
    "full stack": ["Stack Navigator", "End-to-End Engineer", "System Synthesizer", "Layer Liberator"],
    "design": ["Pixel Perfectionist", "Visual Virtuoso", "Design Demigod", "Aesthetic Architect"],
    "devops": ["Pipeline Pilot", "Deploy Druid", "Infrastructure Imp", "Container Commander"],
    "mobile": ["Touch Tactician", "Native Navigator", "Pocket Pioneer", "App Artisan"],
    "ai": ["Model Whisperer", "Prompt Polymath", "Neural Navigator", "Token Tactician"],
    "product": ["Spec Soothsayer", "Roadmap Reader", "Feature Foreseer", "Vision Vaultkeeper"],
}
GENERIC_TITLES = ["Builder", "Maker", "Hacker", "Creator", "Innovator", "Trailblazer"]


def generate_title(role: str, name: str) -> str:
    normalized_role = role.lower().strip()
    pool = GENERIC_TITLES
    for keyword, titles in TITLE_RULES.items():
        if keyword in normalized_role:
            pool = titles
            break
    seed = hashlib.sha256(f"{name}|{role}".encode("utf-8")).digest()
    return pool[int.from_bytes(seed[:4], "big") % len(pool)]
