import { Download, ExternalLink } from 'lucide-react';
import Button from './Button';

export default function CardPreview({ imageUrl, onDownload, onShare }) {
  return <section aria-live="polite" className="animate-[fadeIn_.4s_ease-out] rounded-3xl border border-white/10 bg-white/[0.05] p-4 sm:p-6">
    <div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d8ff44]">Your builder ID</p><h2 className="mt-1 text-xl font-bold text-white">Ready to share</h2></div><span className="rounded-full bg-[#d8ff44]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#d8ff44]">#FrameInGoa</span></div>
    <img src={imageUrl} alt="Generated Builder ID card" className="aspect-square w-full rounded-2xl bg-black/30 object-contain shadow-2xl" />
    <div className="mt-4 grid grid-cols-2 gap-3"><Button onClick={onDownload}><Download size={16} />Download</Button><Button variant="secondary" onClick={onShare}><ExternalLink size={16} />Share on X</Button></div>
  </section>;
}
