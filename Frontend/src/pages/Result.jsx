import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import GoaTrainTransition from '../components/GoaTrainTransition';

/* ─── Night Goa Background ────────────────────────────────── */
function NightGoaBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#031b25]" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_58%,#a9fff0_0%,#168d83_16%,#07504f_38%,#031b25_78%)]" />
      <div className="absolute left-1/2 top-[38%] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full opacity-70 blur-[2px]"
        style={{ background: 'repeating-conic-gradient(from -5deg, rgba(157,255,239,.78) 0deg 3deg, transparent 3deg 12deg)', maskImage: 'radial-gradient(circle, black 0 35%, transparent 70%)' }} />
      <div className="absolute left-1/2 top-[48%] h-28 w-72 -translate-x-1/2 rounded-full bg-[#b8fff2] opacity-80 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(180deg,transparent,#031b25_72%)]" />
      <div className="absolute -bottom-20 -left-10 h-72 w-72 rotate-12 rounded-[60%] bg-[#02151c] opacity-95" />
      <div className="absolute -bottom-24 -right-10 h-80 w-80 -rotate-12 rounded-[60%] bg-[#02151c] opacity-95" />
      {/* Deep gradient sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050e08] via-[#0a1a0f] to-[#10261B]" />

      {/* Stars */}
      {[...Array(40)].map((_, i) => (
        <div key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() > 0.8 ? 3 : 1.5,
            height: Math.random() > 0.8 ? 3 : 1.5,
            top: `${Math.random() * 60}%`,
            left: `${Math.random() * 100}%`,
            animation: `starBlink ${2 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}

      {/* Moon */}
      <div className="absolute top-10 right-20 w-20 h-20 rounded-full bg-[#FFF3D6] opacity-90"
        style={{ boxShadow: '0 0 40px 10px rgba(255,243,214,0.3)' }} />
      <div className="absolute top-12 right-16 w-16 h-16 rounded-full bg-[#0a1a0f]" />

      {/* Ocean at night */}
      <div className="absolute bottom-0 left-0 right-0 h-48">
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#0d2018] border-t border-[#FFD400]/10"
          style={{ animation: 'wavePulse 4s ease-in-out infinite' }} />
        <div className="absolute bottom-24 left-0 right-0 h-6">
          <svg viewBox="0 0 1200 25" className="w-full" preserveAspectRatio="none">
            <path d="M0,12 C150,0 300,24 450,12 C600,0 750,24 900,12 C1050,0 1150,24 1200,12 L1200,25 L0,25 Z"
              fill="#0d2018" />
          </svg>
        </div>
      </div>

      {/* Palm silhouettes */}
      <div className="absolute bottom-22 left-0 opacity-70 text-6xl"
        style={{ animation: 'palmSway 4s ease-in-out infinite alternate', transformOrigin: 'bottom center' }}>
        <svg width="80" height="140" viewBox="0 0 80 140">
          <path d="M38,140 C36,110 40,80 42,50" stroke="#06140a" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d="M42,50 C20,40 0,45 5,30" fill="#06140a" />
          <path d="M42,50 C60,35 80,38 78,25" fill="#06140a" />
          <path d="M42,50 C30,30 28,20 18,22" fill="#050e08" />
          <path d="M42,50 C55,32 58,22 68,24" fill="#050e08" />
        </svg>
      </div>
      <div className="absolute bottom-22 right-0 opacity-70"
        style={{ animation: 'palmSway 5s ease-in-out infinite alternate-reverse', transformOrigin: 'bottom center' }}>
        <svg width="80" height="140" viewBox="0 0 80 140" style={{ transform: 'scaleX(-1)' }}>
          <path d="M38,140 C36,110 40,80 42,50" stroke="#06140a" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d="M42,50 C20,40 0,45 5,30" fill="#06140a" />
          <path d="M42,50 C60,35 80,38 78,25" fill="#06140a" />
          <path d="M42,50 C30,30 28,20 18,22" fill="#050e08" />
          <path d="M42,50 C55,32 58,22 68,24" fill="#050e08" />
        </svg>
      </div>

      {/* Grain overlay */}
      <div className="absolute inset-0 paper-grain opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_58%,rgba(169,255,240,.9)_0%,rgba(22,141,131,.72)_16%,rgba(7,80,79,.88)_38%,rgba(3,27,37,.98)_78%)]" />
      <div className="absolute left-1/2 top-[38%] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full opacity-80"
        style={{ background: 'repeating-conic-gradient(from -5deg, rgba(157,255,239,.72) 0deg 3deg, transparent 3deg 12deg)', maskImage: 'radial-gradient(circle, black 0 35%, transparent 70%)' }} />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(180deg,transparent,#031b25_72%)]" />
    </div>
  );
}

/* ─── Result Page ──────────────────────────────────────────── */
export default function Result({ generatedCard }) {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [rotationBack, setRotationBack] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  if (!generatedCard) return <Navigate to="/create" replace />;

  const { imageUrl, backImageUrl, shareId, imageType = 'PNG' } = generatedCard;
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
  const resolvedBackImageUrl = backImageUrl || `${apiBaseUrl}/api/card/${shareId}/back-image`;

  /* ── 3D tilt on mouse move ──────────────────────────────── */
  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRotation({
      x: ((y - rect.height / 2) / (rect.height / 2)) * -12,
      y: ((x - rect.width / 2) / (rect.width / 2)) * 12,
    });
  }, []);

  const handleMouseLeave = useCallback(() => setRotation({ x: 0, y: 0 }), []);

  const handleMouseMoveBack = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRotationBack({
      x: ((y - rect.height / 2) / (rect.height / 2)) * -12,
      y: ((x - rect.width / 2) / (rect.width / 2)) * 12,
    });
  }, []);

  const handleMouseLeaveBack = useCallback(() => setRotationBack({ x: 0, y: 0 }), []);

  /* ── PDF Download ───────────────────────────────────────── */
  const handleDownloadPdf = async () => {
    const cardPageSize = [1586, 992];
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: cardPageSize });
    pdf.addImage(imageUrl, imageType, 0, 0, ...cardPageSize);
    pdf.addPage(cardPageSize, 'landscape');
    pdf.addImage(resolvedBackImageUrl, imageType, 0, 0, ...cardPageSize);
    pdf.save(`HH-Goa-2026-${(shareId || 'builder').toUpperCase()}.pdf`);
  };

  /* ── Twitter / X share ──────────────────────────────────── */
  const handleShareX = () => {
    const text = `Just built my Builder ID for HH Goa 2026 🌴💻\nSee you in Goa.\n#HHGoa2026 #HackerHouse #FrameInGoa`;
    const shareLink = `${apiBaseUrl}/api/card/${shareId}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareLink)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCreateAnother = () => {
    setTransitioning(true);
    setTimeout(() => navigate('/create'), 2200);
  };

  return (
    <div className="result-page min-h-screen relative overflow-hidden text-[#FFF3D6] flex flex-col items-center justify-center p-4 gap-8">
      <NightGoaBackground />

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-6">

        {/* ── Title ──────────────────────────────────────── */}
        <div className="text-center" style={{ animation: 'fadeInUp 0.7s ease-out both' }}>
          <p className="result-meta font-mono text-sm md:text-xs text-[#FFD400]/70 uppercase tracking-widest mb-2">
            ★ YOUR BUILDER PASS IS READY ★
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-[#FF0F87]
              drop-shadow-[3px_3px_0_rgba(255,212,0,0.8)]">
            YOUR GOA ID
          </h1>
        </div>

        {/* ── 3D Floating Card ─────────────────────────── */}
        <div
          className="perspective-1000 cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ animation: 'fadeInUp 0.9s ease-out 0.1s both' }}
          aria-label="Your generated Builder ID card"
        >
          <div
            ref={cardRef}
            className="preserve-3d transition-transform duration-200 ease-out"
            style={{
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.9)) drop-shadow(0 0 20px rgba(0,107,60,0.4))',
            }}
          >
            {/* Floating animation wrapper */}
            <div style={{ animation: 'floatCard 6s ease-in-out infinite' }}>
              <img
                src={imageUrl}
                alt="Generated HH Goa 2026 Builder ID"
                className="result-card w-[min(96vw,64rem)] max-w-full rounded-lg
                    border border-[#FFD400]/30"
                crossOrigin="anonymous"
              />
            </div>
          </div>
        </div>

        {shareId && (
          <div className="flex flex-col items-center gap-3" style={{ animation: 'fadeInUp 1s ease-out 0.2s both' }}>
            <p className="result-meta font-mono text-sm md:text-xs text-[#FFD400]/70 uppercase tracking-widest">CARD BACK / QR SCANNER</p>

            {/* ── 3D Floating Back Card ───────────────────── */}
            <div
              className="perspective-1000 cursor-pointer"
              onMouseMove={handleMouseMoveBack}
              onMouseLeave={handleMouseLeaveBack}
              aria-label="Back of your generated Builder ID card with QR scanner"
            >
              <div
                className="preserve-3d transition-transform duration-200 ease-out"
                style={{
                  transform: `rotateX(${rotationBack.x}deg) rotateY(${rotationBack.y}deg)`,
                  filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.9)) drop-shadow(0 0 20px rgba(0,107,60,0.4))',
                }}
              >
                <div style={{ animation: 'floatCard 6s ease-in-out infinite', animationDelay: '1s' }}>
                  <img
                    src={resolvedBackImageUrl}
                    alt="Back of your generated Builder ID card with QR scanner"
                    className="result-card w-[min(96vw,64rem)] max-w-full rounded-lg border border-[#FFD400]/30"
                    crossOrigin="anonymous"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Share ID badge ───────────────────────────── */}
        {shareId && (
          <div className="result-meta font-mono text-sm md:text-xs text-[#FFF3D6]/70 border border-[#FFF3D6]/20 px-4 py-2">
            BUILDER ID: <span className="text-[#FFD400] font-bold">#{shareId.slice(0, 8).toUpperCase()}</span>
          </div>
        )}

        {/* ── Action Buttons ───────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
          style={{ animation: 'fadeInUp 1s ease-out 0.3s both' }}
        >
          <button
            id="download-pdf-btn"
            onClick={handleDownloadPdf}
            className="sticker-btn green flex-1 flex items-center justify-center gap-2"
          >
            📄 DOWNLOAD PDF
          </button>

          <button
            id="share-x-btn"
            onClick={handleShareX}
            className="flex-1 flex items-center justify-center gap-2
                font-mono font-bold text-sm uppercase tracking-wider
                bg-black text-white border-3 border-[#FFF3D6] px-6 py-3
                drop-shadow-[4px_4px_0_rgba(255,255,255,0.3)]
                hover:translate-x-[2px] hover:translate-y-[2px]
                hover:drop-shadow-[2px_2px_0_rgba(255,255,255,0.3)] transition-all"
            style={{ border: '3px solid rgba(255,255,255,0.4)', boxShadow: '4px 4px 0 rgba(255,255,255,0.3)' }}
          >
            𝕏 SHARE ON X
          </button>
        </div>

        {/* ── Create Another ───────────────────────────── */}
        <button
          id="create-another-btn"
          onClick={handleCreateAnother}
          className="result-meta font-mono text-sm md:text-xs text-[#FFD400]/70 uppercase tracking-widest
              hover:text-[#FF0F87] transition-colors underline underline-offset-4
              focus-visible:outline-2 focus-visible:outline-[#FFD400]"
          style={{ animation: 'fadeInUp 1.1s ease-out 0.4s both' }}
        >
          CREATE ANOTHER ID →
        </button>

        {/* ── Retro footer labels ──────────────────────── */}
        <div className="result-footer flex gap-6 flex-wrap justify-center font-mono text-xs text-[#FFF3D6]/40 uppercase tracking-widest"
          style={{ animation: 'fadeInUp 1.2s ease-out 0.5s both' }}>
          <span>HH GOA 2026</span>
          <span>·</span>
          <span>GOA, INDIA</span>
          <span>·</span>
          <span>28–31 OCT 2026</span>
          <span>·</span>
          <span>#FRAMEINGOA</span>
        </div>
      </div>

      <GoaTrainTransition isActive={transitioning} />
    </div>
  );
}
