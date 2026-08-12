import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoaTrainTransition from '../components/GoaTrainTransition';

/* ─── SVG Goa Scene pieces ────────────────────────────────────── */
function GoaScenery() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">

      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#004B2A] via-[#006B3C] to-[#006B3C]" />

      {/* SUN — top right, slow glow */}
      <div
        className="absolute top-16 right-16 w-48 h-48 rounded-full bg-[#FFD400]"
        style={{ animation: 'sunGlow 4s ease-in-out infinite' }}
      />
      {/* Sun rays (rings) */}
      <div className="absolute top-8 right-8 w-64 h-64 rounded-full border-4 border-[#FFD400]/30" />
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full border-2 border-[#FFD400]/15" />

      {/* Cloud 1 */}
      <div className="absolute top-28 left-0 opacity-70"
        style={{ animation: 'cloudDrift 28s linear infinite' }}>
        <svg width="180" height="60" viewBox="0 0 180 60">
          <ellipse cx="90" cy="45" rx="88" ry="28" fill="#FFF3D6" opacity="0.7" />
          <ellipse cx="60" cy="38" rx="50" ry="30" fill="#FFF3D6" opacity="0.9" />
          <ellipse cx="120" cy="36" rx="45" ry="25" fill="#FFF3D6" opacity="0.8" />
        </svg>
      </div>
      {/* Cloud 2 */}
      <div className="absolute top-40 left-0 opacity-50"
        style={{ animation: 'cloudDrift 40s linear infinite 8s' }}>
        <svg width="140" height="50" viewBox="0 0 140 50">
          <ellipse cx="70" cy="38" rx="68" ry="22" fill="#FFF3D6" opacity="0.6" />
          <ellipse cx="45" cy="30" rx="40" ry="22" fill="#FFF3D6" opacity="0.8" />
          <ellipse cx="100" cy="28" rx="35" ry="18" fill="#FFF3D6" opacity="0.7" />
        </svg>
      </div>

      {/* Birds */}
      <div className="absolute top-24 left-0 text-2xl"
        style={{ animation: 'birdFly 14s linear infinite' }}>🕊️</div>
      <div className="absolute top-44 left-0 text-xl"
        style={{ animation: 'birdFly 20s linear infinite 5s' }}>🕊️</div>

      {/* Ocean / Beach stripe */}
      <div className="absolute bottom-0 left-0 right-0 h-56">
        {/* Sand */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-[#F4D06F]" />
        {/* Water */}
        <div className="absolute bottom-28 left-0 right-0 h-28 bg-[#0D9B8C]"
          style={{ animation: 'wavePulse 3s ease-in-out infinite' }} />
        {/* Wave foam */}
        <svg className="absolute bottom-[148px] left-0 w-full" viewBox="0 0 1200 30" preserveAspectRatio="none">
          <path d="M0,15 C100,0 200,30 300,15 C400,0 500,30 600,15 C700,0 800,30 900,15 C1000,0 1100,30 1200,15 L1200,30 L0,30 Z"
            fill="#FFF3D6" opacity="0.5" />
        </svg>
      </div>

      {/* Palm trees */}
      <div className="absolute bottom-24 left-8 origin-bottom"
        style={{ animation: 'palmSway 3s ease-in-out infinite alternate' }}>
        <PalmTree size={160} />
      </div>
      <div className="absolute bottom-24 left-44 origin-bottom"
        style={{ animation: 'palmSway 4s ease-in-out infinite alternate-reverse' }}>
        <PalmTree size={110} />
      </div>
      <div className="absolute bottom-24 right-12 origin-bottom"
        style={{ animation: 'palmSway 3.5s ease-in-out infinite alternate' }}>
        <PalmTree size={180} flip />
      </div>
      <div className="absolute bottom-24 right-52 origin-bottom"
        style={{ animation: 'palmSway 5s ease-in-out infinite alternate-reverse' }}>
        <PalmTree size={120} flip />
      </div>

      {/* Scooter */}
      <div className="absolute bottom-28 left-1/2 -translate-x-full text-5xl">🛵</div>

      {/* Retro signs */}
      <div className="absolute bottom-36 left-1/2 ml-10">
        <svg width="90" height="70" viewBox="0 0 90 70">
          <rect x="40" y="0" width="6" height="70" fill="#8B5A2B" />
          <rect x="2" y="8" width="72" height="28" rx="4" fill="#FF0F87" stroke="#10261B" strokeWidth="2" />
          <text x="38" y="27" textAnchor="middle" fill="white" fontSize="10" fontFamily="'Space Mono',monospace" fontWeight="bold">GOA BEACH</text>
        </svg>
      </div>

      {/* Tropical plants */}
      <div className="absolute bottom-24 left-1/4 text-4xl opacity-80">🌿</div>
      <div className="absolute bottom-24 right-1/4 text-3xl opacity-70">🌺</div>
    </div>
  );
}

function PalmTree({ size = 120, flip = false }) {
  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 80 120"
      style={flip ? { transform: 'scaleX(-1)' } : {}}>
      {/* Trunk */}
      <path d="M38,120 C36,90 40,60 42,30" stroke="#8B5A2B" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* Leaves */}
      <path d="M42,30 C20,20 0,25 5,10 C15,5 35,25 42,30" fill="#006B3C" />
      <path d="M42,30 C60,15 80,18 78,5 C70,0 50,20 42,30" fill="#006B3C" />
      <path d="M42,30 C30,10 28,0 18,2 C12,5 30,28 42,30" fill="#004B2A" />
      <path d="M42,30 C55,12 58,2 68,4 C74,7 54,28 42,30" fill="#004B2A" />
      <path d="M42,30 C40,10 38,0 42,0 C46,0 44,20 42,30" fill="#006B3C" />
    </svg>
  );
}

/* ─── Marquee ─────────────────────────────────────────────────── */
function RetroMarquee() {
  const items = ['BUILD', 'SHIP', 'REPEAT', '✦', 'BUILD IN GOA', 'SHIP FROM PARADISE', '✦',
    'HH GOA 2026', '✦', 'BUILD', 'SHIP', 'REPEAT', '✦', 'BUILD IN GOA', 'SHIP FROM PARADISE', '✦', 'HH GOA 2026', '✦'];
  return (
    <div className="overflow-hidden bg-[#FF0F87] border-y-2 border-[#10261B] py-2 select-none">
      <div className="flex gap-8 whitespace-nowrap text-white font-mono font-bold text-sm tracking-widest"
        style={{ animation: 'marqueeScroll 18s linear infinite', width: 'max-content' }}>
        {items.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}

/* ─── Landing Page ────────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);

  const handleCreateNow = () => {
    setTransitioning(true);
    setTimeout(() => navigate('/create'), 2200);
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-[#FFF3D6]">
      <GoaScenery />

      {/* Scanlines CRT overlay */}
      <div className="absolute inset-0 pointer-events-none scanlines" />

      {/* ── HEADER ────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        {/* HH GOA 2026 Logo box */}
        <div className="bg-[#004B2A] border-2 border-[#FFF3D6] px-3 py-2
            drop-shadow-[4px_4px_0_rgba(255,243,214,1)] font-mono text-[#FFF3D6] text-sm font-bold leading-tight">
          <div>HH GOA</div>
          <div className="text-[#FFD400]">2026</div>
        </div>

        <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-widest">
          <button className="hover:text-[#FFD400] transition-colors focus-visible:outline-2 focus-visible:outline-[#FFD400]">
            CHECK HYPE
          </button>
          <button
            id="create-now-btn"
            onClick={handleCreateNow}
            aria-label="Create your Builder ID"
            className="sticker-btn pink focus-visible:outline-2 focus-visible:outline-white"
          >
            CREATE NOW
          </button>
        </nav>
      </header>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-6 pb-64 px-4 text-center">

        {/* Pixel arrow decoration */}
        <p className="font-mono text-xs text-[#FFD400]/70 tracking-[0.3em] mb-4"
          style={{ animation: 'fadeInUp 0.6s ease-out both' }}>
          ★ HACKER HOUSE PRESENTS ★
        </p>

        {/* Main hero typography */}
        <div className="relative" style={{ animation: 'fadeInUp 0.9s ease-out 0.1s both' }}>
          <h1 className="font-display text-[min(18vw,160px)] leading-[0.88] text-[#FFD400]
              drop-shadow-[6px_6px_0_#E7473C] select-none">
            HACKER<br />HOUSE
          </h1>
          {/* गोवा overlaid in pink */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              font-display text-[min(20vw,170px)] text-[#FF0F87]/25 leading-none pointer-events-none"
            aria-hidden="true">
            गोवा
          </div>
          {/* गोवा standalone below — tilted */}
          <div className="font-serif italic text-[min(8vw,72px)] text-[#FF0F87]
              drop-shadow-[3px_3px_0_#10261B] -mt-2 -rotate-3"
            style={{ animation: 'fadeInUp 1s ease-out 0.3s both' }}>
            गोवा
          </div>
        </div>

        {/* Location & Date badge */}
        <div className="mt-8 bg-[#004B2A]/90 border-2 border-[#FFD400]
            drop-shadow-[5px_5px_0_rgba(255,212,0,1)] px-8 py-4 font-mono
            flex flex-col items-center gap-2"
          style={{ animation: 'fadeInUp 1.1s ease-out 0.4s both' }}>
          <span className="text-[#FFD400] text-xl tracking-[0.25em] font-bold">GOA, INDIA</span>
          <span className="text-[#FFF3D6] text-base tracking-[0.15em]">28 — 31 OCT 2026</span>
          <div className="flex gap-3 text-xs text-[#FF0F87] font-bold mt-1 tracking-widest">
            <span>BUILD IN GOA</span><span>•</span><span>SHIP FROM PARADISE</span>
          </div>
        </div>

        {/* Big CREATE NOW sticker */}
        <button
          onClick={handleCreateNow}
          id="hero-create-btn"
          aria-label="Create your Builder ID"
          className="mt-10 sticker-btn pink text-xl px-10 py-5 rotate-[-1deg]
              hover:rotate-0 transition-transform duration-200
              focus-visible:outline-2 focus-visible:outline-white"
          style={{ animation: 'fadeInUp 1.2s ease-out 0.5s both' }}
        >
          CREATE NOW →
        </button>

        {/* Micro badges */}
        <div className="mt-6 flex gap-4 flex-wrap justify-center"
          style={{ animation: 'fadeInUp 1.3s ease-out 0.6s both' }}>
          {['BUILDERS 🛠️', 'HACKERS 💻', 'GOA 🌴'].map(b => (
            <span key={b} className="font-mono text-xs bg-[#FFD400] text-[#10261B]
                px-3 py-1 border border-[#10261B] font-bold">{b}</span>
          ))}
        </div>
      </main>

      {/* ── MARQUEE TICKER ────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <RetroMarquee />
      </div>

      <GoaTrainTransition isActive={transitioning} />
    </div>
  );
}
