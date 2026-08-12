import React from 'react';

export default function GoaTrainTransition({ isActive }) {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Background Dimming */}
      <div className="absolute inset-0 bg-[#002b18]/85 backdrop-blur-sm transition-opacity duration-700" />

      {/* Railway Track Scene */}
      <div className="absolute bottom-1/3 w-full h-8 bg-[#1a221a] border-y-4 border-[#FFD400]/80 flex items-center justify-around overflow-hidden">
        {/* Track Sleepers */}
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className="w-2 h-full bg-[#3d4f3d]" />
        ))}
      </div>
      {/* Steel Rail */}
      <div className="absolute bottom-[calc(33%+14px)] w-full h-1 bg-[#b0c4de] shadow-[0_0_8px_rgba(255,255,255,0.8)]" />

      {/* VANDE BHARAT EXPRESS TRAIN */}
      <div className="absolute bottom-[calc(33%+10px)] left-0 w-[850px] h-36 animate-[trainMove_1.8s_ease-in-out_forwards] flex items-end drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)]">
        
        {/* ENGINE NOSE (Aerodynamic Saffron/Grey Vande Bharat Locomotive) */}
        <div className="relative w-72 h-32 flex-shrink-0">
          <svg viewBox="0 0 300 130" className="w-full h-full">
            <defs>
              <linearGradient id="vbSaffron" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6D00" />
                <stop offset="60%" stopColor="#FF4500" />
                <stop offset="100%" stopColor="#D83000" />
              </linearGradient>
              <linearGradient id="vbGrey" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4A5568" />
                <stop offset="100%" stopColor="#1A202C" />
              </linearGradient>
            </defs>

            {/* Aerodynamic Engine Body */}
            <path d="M 0,30 L 170,10 C 240,10 280,35 298,75 C 302,85 295,115 280,118 L 0,118 Z" fill="url(#vbSaffron)" />

            {/* Grey Top Accent */}
            <path d="M 0,10 L 170,10 C 220,10 250,22 270,40 L 0,40 Z" fill="url(#vbGrey)" />

            {/* Black Windshield Glass Band */}
            <path d="M 120,22 L 180,22 C 225,22 255,38 272,62 C 265,66 230,68 185,68 L 120,68 Z" fill="#0D1117" />
            
            {/* Windshield Reflection */}
            <path d="M 160,26 L 195,26 C 225,26 245,36 258,52 L 205,52 Z" fill="#38BDF8" opacity="0.4" />

            {/* Side Black Window Band */}
            <rect x="0" y="42" width="115" height="28" rx="4" fill="#0D1117" />
            <rect x="15" y="46" width="35" height="20" rx="2" fill="#38BDF8" opacity="0.6" />
            <rect x="60" y="46" width="35" height="20" rx="2" fill="#38BDF8" opacity="0.6" />

            {/* White/Orange Livery Stripes */}
            <path d="M 0,74 L 275,74 C 285,82 288,95 285,102 L 0,102 Z" fill="#FFFFFF" opacity="0.9" />
            <path d="M 0,78 L 270,78 C 280,84 282,92 280,98 L 0,98 Z" fill="url(#vbSaffron)" />

            {/* Vande Bharat Logo Emblem */}
            <circle cx="230" cy="88" r="10" fill="#0D1117" stroke="#FFD400" strokeWidth="2" />
            <text x="230" y="92" textAnchor="middle" fill="#FFD400" fontSize="9" fontWeight="bold" fontFamily="sans-serif">VB</text>

            {/* Headlights Glowing White/Blue */}
            <ellipse cx="282" cy="72" rx="6" ry="4" fill="#FFFFFF" className="animate-pulse" />
            <ellipse cx="282" cy="72" rx="10" ry="8" fill="#38BDF8" opacity="0.5" />

            {/* Lower Bumper Grid */}
            <path d="M 230,118 L 280,118 L 265,128 L 210,128 Z" fill="#1A202C" />

            {/* Wheels / Bogie */}
            <circle cx="50" cy="120" r="8" fill="#1A202C" stroke="#A0AEC0" strokeWidth="3" />
            <circle cx="100" cy="120" r="8" fill="#1A202C" stroke="#A0AEC0" strokeWidth="3" />
            <circle cx="210" cy="120" r="8" fill="#1A202C" stroke="#A0AEC0" strokeWidth="3" />
          </svg>
        </div>

        {/* PASSENGER COACH 1 */}
        <div className="relative w-64 h-28 -ml-2 flex-shrink-0">
          <svg viewBox="0 0 250 110" className="w-full h-full">
            {/* Coach Body */}
            <rect x="0" y="10" width="250" height="90" rx="6" fill="#FF4500" />
            {/* Grey Roof */}
            <rect x="0" y="0" width="250" height="16" rx="4" fill="#4A5568" />
            {/* Continuous Black Glass Strip */}
            <rect x="10" y="24" width="230" height="32" rx="4" fill="#0D1117" />
            
            {/* Individual Windows */}
            {[20, 65, 110, 155, 200].map((wx, idx) => (
              <rect key={idx} x={wx} y="28" width="35" height="24" rx="3" fill="#38BDF8" opacity="0.75" />
            ))}

            {/* White & Orange Livery Stripe */}
            <rect x="0" y="62" width="250" height="12" fill="#FFFFFF" />
            <rect x="0" y="66" width="250" height="6" fill="#FF6D00" />

            {/* Vande Bharat Text */}
            <text x="125" y="86" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif" letterSpacing="2">VANDE BHARAT EXPRESS</text>

            {/* Wheels */}
            <circle cx="45" cy="102" r="7" fill="#1A202C" stroke="#A0AEC0" strokeWidth="2" />
            <circle cx="85" cy="102" r="7" fill="#1A202C" stroke="#A0AEC0" strokeWidth="2" />
            <circle cx="165" cy="102" r="7" fill="#1A202C" stroke="#A0AEC0" strokeWidth="2" />
            <circle cx="205" cy="102" r="7" fill="#1A202C" stroke="#A0AEC0" strokeWidth="2" />
          </svg>
        </div>

        {/* PASSENGER COACH 2 */}
        <div className="relative w-64 h-28 -ml-2 flex-shrink-0">
          <svg viewBox="0 0 250 110" className="w-full h-full">
            <rect x="0" y="10" width="250" height="90" rx="6" fill="#FF4500" />
            <rect x="0" y="0" width="250" height="16" rx="4" fill="#4A5568" />
            <rect x="10" y="24" width="230" height="32" rx="4" fill="#0D1117" />
            
            {[20, 65, 110, 155, 200].map((wx, idx) => (
              <rect key={idx} x={wx} y="28" width="35" height="24" rx="3" fill="#38BDF8" opacity="0.75" />
            ))}

            <rect x="0" y="62" width="250" height="12" fill="#FFFFFF" />
            <rect x="0" y="66" width="250" height="6" fill="#FF6D00" />

            <text x="125" y="86" textAnchor="middle" fill="#FFD400" fontSize="10" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1">HH GOA 2026 SPECIAL</text>

            <circle cx="45" cy="102" r="7" fill="#1A202C" stroke="#A0AEC0" strokeWidth="2" />
            <circle cx="85" cy="102" r="7" fill="#1A202C" stroke="#A0AEC0" strokeWidth="2" />
            <circle cx="165" cy="102" r="7" fill="#1A202C" stroke="#A0AEC0" strokeWidth="2" />
            <circle cx="205" cy="102" r="7" fill="#1A202C" stroke="#A0AEC0" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Speed Indicator Badge */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-[#0D1117]/90 border-2 border-[#FF6D00] px-6 py-2 rounded-full text-[#FFD400] font-mono text-sm tracking-widest font-bold shadow-lg flex items-center gap-3">
        <span className="w-3 h-3 rounded-full bg-[#FF4500] animate-ping" />
        VANDE BHARAT EXPRESS — GOA BOUND
      </div>
    </div>
  );
}
