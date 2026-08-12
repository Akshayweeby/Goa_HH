import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useCardGenerator from '../hooks/useCardGenerator';
import PhotoUpload from '../components/PhotoUpload';
import GoaTrainTransition from '../components/GoaTrainTransition';

/* ── Retro Laptop showing live preview ─────────────────────── */
function RetroLaptop({ photoPreview, name, role }) {
  return (
    <div className="relative" style={{ animation: 'floatCard 6s ease-in-out infinite' }} aria-label="Live builder ID preview">
      {/* Screen bezel */}
      <div className="relative bg-[#10261B] border-[14px] border-[#d4c5a0] rounded-t-2xl overflow-hidden shadow-2xl scanlines"
        style={{ aspectRatio: '4/3', minWidth: 320 }}>

        {/* Screen glow gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#FFD400]/5 to-transparent pointer-events-none z-10" />

        {/* Scanline CRT overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 4px)' }} />

        {/* Screen content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 gap-3 z-20">
          {/* Photo area */}
          {photoPreview ? (
            <img src={photoPreview} alt="Your photo preview"
              className="w-28 h-28 rounded-full border-4 border-[#FF0F87] object-cover shadow-lg"
              style={{ animation: 'fadeIn 0.4s ease-out' }} />
          ) : (
            <div className="w-28 h-28 rounded-full border-4 border-dashed border-[#FF0F87]/60
                flex items-center justify-center text-5xl bg-[#004B2A]/40">
              🧑‍💻
            </div>
          )}

          <div className="font-serif text-2xl text-[#FFD400] text-center leading-tight min-h-[2rem]"
            style={{ transition: 'all 0.3s', animation: name ? 'fadeIn 0.3s ease-out' : 'none' }}>
            {name || <span className="opacity-30">YOUR NAME</span>}
          </div>

          {role && (
            <div className="font-mono text-xs font-bold bg-[#FFD400] text-[#10261B] px-3 py-1 border border-[#10261B]"
              style={{ animation: 'fadeIn 0.3s ease-out' }}>
              {role}
            </div>
          )}
          {!role && (
            <div className="font-mono text-xs text-[#FFF3D6]/20">YOUR ROLE</div>
          )}

          {/* Status bar */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-between px-3 text-[10px] font-mono text-[#FFF3D6]/30">
            <span>HH GOA OS v9.9</span>
            <span className="animate-pulse">●</span>
          </div>
        </div>
      </div>

      {/* Laptop hinge & base */}
      <div className="w-[115%] -ml-[7.5%] h-4 bg-[#c0b090] rounded-none" />
      <div className="w-[120%] -ml-[10%] h-8 bg-[#d4c5a0] rounded-b-2xl border-x-[14px] border-b-[14px]
          border-[#d4c5a0] flex justify-center items-center shadow-xl">
        <div className="w-24 h-3 bg-[#b0a080] rounded-b-lg opacity-60" />
      </div>
    </div>
  );
}

/* ── Loading scene (while backend generates) ────────────────── */
function LoadingScene() {
  const messages = [
    'BUILDING YOUR GOA ID...',
    'PACKING THE BEACH BAG...',
    'PRINTING YOUR BUILDER PASS...',
    'SHIPPING FROM GOA 🌴...',
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % messages.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#004B2A] flex flex-col items-center justify-center gap-8">
      {/* Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#002b18] via-[#004B2A] to-[#006B3C] pointer-events-none" />

      {/* Cycling message */}
      <div className="relative z-10 text-center">
        <p className="font-display text-3xl md:text-4xl text-[#FFD400]"
          key={idx} style={{ animation: 'fadeInUp 0.5s ease-out' }}>
          {messages[idx]}
        </p>
        <div className="mt-4 flex gap-2 justify-center">
          {messages.map((_, i) => (
            <div key={i}
              className="w-2 h-2 rounded-full transition-colors duration-300"
              style={{ background: i === idx ? '#FFD400' : 'rgba(255,212,0,0.3)' }} />
          ))}
        </div>
      </div>

      {/* The train passing through as the ID is generated */}
      <GoaTrainTransition isActive={true} />

      {/* Sequence labels */}
      <div className="relative z-10 flex gap-8 font-mono text-xs text-[#FFF3D6]/50 uppercase tracking-widest">
        {['BUILDING', '→', 'PRINTING', '→', 'SHIPPING FROM GOA'].map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Create ID Page ─────────────────────────────────────────── */
export default function CreateId({ setGeneratedCard }) {
  const navigate = useNavigate();
  const { generate, loading, error } = useCardGenerator();

  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [teamName, setTeamName] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    if (!file) { setPhotoPreview(''); return; }
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !name.trim() || !role.trim()) return;
    const result = await generate(file, { name: name.trim(), role: role.trim(), teamName: teamName.trim() });
    if (result) {
      setGeneratedCard(result);
      navigate('/result');
    }
  };

  return (
    <div className="min-h-screen bg-[#006B3C] text-[#FFF3D6] relative overflow-x-hidden">

      {/* Grain texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] paper-grain" />

      {/* Goa beach scenery strip at top */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-[#FFD400]" />

      {/* Background ocean/sand */}
      <div className="fixed bottom-0 left-0 right-0 h-40 pointer-events-none z-0">
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#F4D06F]" />
        <div className="absolute bottom-20 left-0 right-0 h-20 bg-[#0D9B8C] opacity-60"
          style={{ animation: 'wavePulse 3s ease-in-out infinite' }} />
        <div className="absolute bottom-4 left-2 text-4xl origin-bottom"
          style={{ animation: 'palmSway 3s ease-in-out infinite alternate' }}>🌴</div>
        <div className="absolute bottom-4 right-4 text-5xl origin-bottom"
          style={{ animation: 'palmSway 4s ease-in-out infinite alternate-reverse' }}>🌴</div>
      </div>

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-[#FFD400]/20">
        <div className="font-mono text-xs text-[#FFD400]/60 uppercase tracking-widest">
          HH GOA 2026 &nbsp;/&nbsp; CREATE ID
        </div>
        <button onClick={() => navigate('/')}
          className="font-mono text-xs text-[#FFF3D6]/50 hover:text-[#FFD400] transition-colors focus-visible:outline-[#FFD400]">
          ← BACK
        </button>
      </header>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-10 pb-48">
        <h1 className="font-display text-4xl md:text-5xl text-[#FFD400] mb-2
            drop-shadow-[3px_3px_0_#E7473C]">
          BUILD YOUR ID
        </h1>
        <p className="font-mono text-xs text-[#FFF3D6]/60 mb-10 uppercase tracking-widest">
          YOUR HACKER HOUSE BUILDER PASS — GOA 2026
        </p>

        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* ── FORM PANEL ────────────────────────────────── */}
          <div className="flex-1 w-full max-w-lg">
            <div className="bg-[#004B2A] border-4 border-[#FFD400] drop-shadow-[6px_6px_0_rgba(255,212,0,1)] p-8">

              <form onSubmit={handleSubmit} className="flex flex-col gap-7" noValidate>

                {/* Photo Upload */}
                <fieldset className="border-0 p-0 m-0">
                  <legend className="font-mono text-[#FFD400] text-xs uppercase font-bold tracking-widest mb-3">
                    SHOW US YOUR FACE
                  </legend>
                  <div className="bg-[#10261B] border-2 border-[#FFF3D6]/20 rounded-xl overflow-hidden">
                    <PhotoUpload file={file} onChange={setFile} error="" />
                  </div>
                </fieldset>

                {/* Name */}
                <div>
                  <label htmlFor="name-input"
                    className="block font-mono text-[#FFD400] text-xs uppercase font-bold tracking-widest mb-2">
                    WHAT SHOULD WE CALL YOU?
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    maxLength={30}
                    autoComplete="name"
                    className="w-full bg-[#10261B] text-[#FFF3D6] border-2 border-[#FF0F87]
                        p-3 font-mono text-sm focus:outline-none focus:border-[#FFD400]
                        placeholder:text-[#FFF3D6]/30 transition-colors"
                  />
                </div>

                {/* Additional builder details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    ['team-name-input', 'TEAM NAME', teamName, setTeamName, 'Your team'],
                  ].map(([id, label, value, setter, placeholder]) => (
                    <div key={id}>
                      <label htmlFor={id} className="block font-mono text-[#FFD400] text-xs uppercase font-bold tracking-widest mb-2">{label}</label>
                      <input id={id} type="text" value={value} onChange={e => setter(e.target.value)} placeholder={placeholder} maxLength={15}
                        className="w-full bg-[#10261B] text-[#FFF3D6] border-2 border-[#FF0F87] p-3 font-mono text-sm focus:outline-none focus:border-[#FFD400] placeholder:text-[#FFF3D6]/30 transition-colors" />
                    </div>
                  ))}
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role-input"
                    className="block font-mono text-[#FFD400] text-xs uppercase font-bold tracking-widest mb-2">
                    WHAT DO YOU BUILD?
                  </label>
                  <input
                    id="role-input"
                    type="text"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    placeholder="e.g. Full Stack Developer"
                    required
                    maxLength={30}
                    className="w-full bg-[#10261B] text-[#FFF3D6] border-2 border-[#FF0F87]
                        p-3 font-mono text-sm focus:outline-none focus:border-[#FFD400]
                        placeholder:text-[#FFF3D6]/30 transition-colors"
                  />
                  <p className="mt-2 font-mono text-[10px] text-[#FFF3D6]/40 leading-relaxed">
                    e.g. AI Engineer · Frontend Developer · Hardware Hacker · Product Designer
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div role="alert" className="bg-[#E7473C]/20 text-[#FFF3D6] border-2 border-[#E7473C] p-3 font-mono text-sm">
                    ⚠ {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  id="build-id-btn"
                  type="submit"
                  disabled={loading || !file || !name.trim() || !role.trim()}
                  className="sticker-btn w-full text-center text-lg py-4
                      disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0"
                >
                  {loading ? 'GENERATING...' : 'BUILD MY ID →'}
                </button>
              </form>
            </div>
          </div>

          {/* ── LAPTOP PREVIEW ────────────────────────────── */}
          <div className="flex-1 w-full flex flex-col items-center gap-4 lg:sticky lg:top-10">
            <p className="font-mono text-xs text-[#FFD400]/70 uppercase tracking-widest mb-2">
              ↓ LIVE PREVIEW
            </p>
            <RetroLaptop photoPreview={photoPreview} name={name} role={role} />
            {/* Decorative labels under laptop */}
            <div className="mt-4 flex gap-3 flex-wrap justify-center">
              {['GOA BEACH', 'PALM TREES', 'YOUR PHOTO'].map(l => (
                <span key={l} className="font-mono text-[10px] border border-[#FFD400]/40 text-[#FFD400]/60 px-2 py-0.5">
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Loading overlay */}
      {loading && <LoadingScene />}
    </div>
  );
}
