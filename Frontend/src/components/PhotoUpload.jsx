import { useCallback, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, RefreshCw, Scissors, UploadCloud } from 'lucide-react';
import Button from './Button';

const accepted = { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/heic': ['.heic'], 'image/heif': ['.heif'] };
const maxSize = 8 * 1024 * 1024;

function createCroppedFile(file, area) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = area.width; canvas.height = area.height;
      const context = canvas.getContext('2d');
      context.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);
      canvas.toBlob((blob) => blob ? resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })) : reject(new Error('Crop failed')), 'image/jpeg', 0.92);
    };
    image.onerror = reject; image.src = URL.createObjectURL(file);
  });
}

export default function PhotoUpload({ file, onChange, error }) {
  const [preview, setPreview] = useState(''); const [cropImage, setCropImage] = useState(''); const [selectedFile, setSelectedFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 }); const [zoom, setZoom] = useState(1); const [area, setArea] = useState(null);
  const onDrop = useCallback((files) => { const next = files[0]; if (!next) return; setSelectedFile(next); if (next.type === 'image/heic' || next.type === 'image/heif') onChange(next); else { setCropImage(URL.createObjectURL(next)); setCrop({ x: 0, y: 0 }); setZoom(1); } }, [onChange]);
  const dropzone = useDropzone({ onDrop, accept: accepted, maxSize, multiple: false });
  useEffect(() => { if (!file || file.type === 'image/heic' || file.type === 'image/heif') { setPreview(''); return undefined; } const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }, [file]);
  const rejection = dropzone.fileRejections[0]?.errors[0]?.message;
  const confirmCrop = async () => { if (!selectedFile || !area) return; const cropped = await createCroppedFile(selectedFile, area); onChange(cropped); setCropImage(''); };
  return <div>
    <div {...dropzone.getRootProps()} className={`relative flex min-h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed transition ${dropzone.isDragActive ? 'border-[#d8ff44] bg-[#d8ff44]/10' : 'border-white/20 bg-white/[0.035] hover:border-white/40'}`}>
      <input {...dropzone.getInputProps()} aria-label="Upload a photo" />
      {preview ? <><img src={preview} alt="Selected upload preview" className="absolute inset-0 h-full w-full object-cover opacity-70" /><div className="absolute inset-0 bg-[#101215]/45" /><div className="relative rounded-full bg-[#101215]/80 px-4 py-2 text-xs font-bold text-white"><RefreshCw size={14} className="mr-2 inline" />Change photo</div></> : <><div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#d8ff44] text-[#101215]"><UploadCloud size={24} /></div><p className="font-bold text-white">{dropzone.isDragActive ? 'Drop it here' : 'Drop your photo here'}</p><p className="mt-2 text-center text-xs text-white/40">or tap to browse · JPG, PNG, HEIC, up to 8 MB</p>{file && <p className="mt-4 text-xs text-[#d8ff44]">{file.name}</p>}</>}
    </div>
    {(error || rejection) && <p className="mt-2 text-xs text-red-300">{error || rejection}</p>}
    {(file?.type === 'image/heic' || file?.type === 'image/heif') && <p className="mt-2 text-xs text-amber-200/80"><ImagePlus size={13} className="mr-1 inline" />HEIC preview and cropping are unavailable here, but it will be processed when you generate your card.</p>}
    {file && preview && <button type="button" onClick={() => setCropImage(preview)} className="mt-3 text-xs font-bold text-[#d8ff44]"><Scissors size={13} className="mr-1 inline" />Crop photo</button>}
    {cropImage && <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4"><div className="w-full max-w-lg rounded-3xl bg-[#17191d] p-5"><h3 className="mb-4 text-lg font-bold">Crop your photo</h3><div className="relative h-[min(70vw,420px)] w-full overflow-hidden rounded-2xl bg-black"><Cropper image={cropImage} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(_, pixels) => setArea(pixels)} /></div><label className="mt-4 block text-xs text-white/60">Zoom<input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="mt-2 w-full accent-[#d8ff44]" /></label><div className="mt-5 grid grid-cols-2 gap-3"><Button type="button" variant="secondary" onClick={() => setCropImage('')}>Cancel</Button><Button type="button" onClick={confirmCrop}>Use this crop</Button></div></div></div>}
  </div>;
}
