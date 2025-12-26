import React, { useState, useEffect } from 'react';
import { toBlob } from 'html-to-image';
import {
  Play,
  Trophy,
  Grid3X3,
  History,
  LayoutDashboard,
  LayoutGrid,
  Send,
  Lock,
  LockOpen,
  AlertCircle,
  Table
} from 'lucide-react';

import { useBingoGame } from './hooks/useBingoGame';
import { useSoundEffects } from './hooks/useSoundEffects';
import { BackgroundAnimation } from './components/layout/BackgroundAnimation';
import { ControlPanel } from './components/game/ControlPanel';
import { MasterBoard } from './components/game/MasterBoard';
import { BingoBall } from './components/game/BingoBall';
import { PatternGrid } from './components/game/PatternGrid';
import { HistoryList } from './components/game/HistoryList';
import { GlassCard } from './components/ui/GlassCard';
import { ActionButton } from './components/ui/ActionButton';
import { GeneratorPanel } from './components/generator/GeneratorPanel';
import { getColIndex, COLUMN_THEME, DARK_MODE_KEY } from './utils/constants';
import { BingoCard, generateBatch } from './utils/generator';

export default function App() {
  const [resetKey, setResetKey] = useState(0);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(DARK_MODE_KEY) === 'true';
    }
    return false;
  });

  const [toast, setToast] = useState<{ message: string, visible: boolean }>({ message: '', visible: false });
  const [isCapturing, setIsCapturing] = useState(false);

  const [bgParticleCount, setBgParticleCount] = useState(18);
  const [bgSpeedMultiplier, setBgSpeedMultiplier] = useState(0.8);

  const [confirmReset, setConfirmReset] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  // Generator State Lifted
  const [count, setCount] = useState<number>(50);
  const [startId, setStartId] = useState<number>(1);
  const [cards, setCards] = useState<BingoCard[]>(() => generateBatch(50, 1)); // Init on load

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ ...toast, visible: false }), 3000);
  };

  const {
    gameState,
    isSpinning,
    displayNumber,
    pendingNumber,
    drawBall,
    resetGame,
    togglePatternCell
  } = useBingoGame();

  // Sound Effects Hook
  const { isMuted, setIsMuted, speak, playSpin, playPop } = useSoundEffects();

  const toggleMute = () => setIsMuted(!isMuted);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem(DARK_MODE_KEY, String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (confirmReset) {
      const timer = setTimeout(() => setConfirmReset(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmReset]);

  // --- Helpers ---
  const hasSelectedPattern = gameState.pattern.some(Boolean);
  const isGameStarted = gameState.calledNumbers.length > 0;
  const isLocked = isGameStarted || isSpinning;
  const isConfigLocked = isGameStarted || isSpinning;

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleResetClick = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetGame();
    setConfirmReset(false);
    setResetKey(prev => prev + 1);
    showToast("✨ Juego reiniciado completamente");
  };

  const handleDrawBall = () => {
    drawBall(showToast, {
      onSpin: playSpin,
      onDraw: (num) => {
        // Format for speech: "B 5" -> "Be cinco"
        const col = getColIndex(num);
        const letter = ['B', 'I', 'N', 'G', 'O'][col];
        speak(`${letter} ${num}`);
      }
    });
  };

  const handleTogglePattern = (index: number) => {
    togglePatternCell(index, showToast, playPop);
  };

  const handleCapture = async (elementId: string, name: string) => {
    if (isCapturing) return;
    setIsCapturing(true);
    showToast(`⏳ Generando imagen de ${name}...`);

    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error("Element not found");

      // Filter out non-element nodes to prevent errors
      const filter = (node: HTMLElement) => {
        const exclusionClasses = ['remove-me', 'secret-div'];
        return !exclusionClasses.some((classname) => node.classList?.contains(classname));
      };

      // Calculate exact dimensions including scroll area
      // Add buffer for the padding we are about to add (24px * 2 = 48px)
      // plus a little extra safety buffer (20px) to ensure no cut-off
      const padding = 48;
      const width = element.scrollWidth + padding;
      const height = element.scrollHeight + padding + 20;

      const blob = await toBlob(element, {
        backgroundColor: darkMode ? '#0f172a' : '#fff1f2',
        filter: filter as any,
        cacheBust: true,
        width: width,
        height: height,
        style: {
          backgroundColor: darkMode ? '#0f172a' : '#fff1f2',
          height: `${height}px`,
          width: `${width}px`,
          margin: '0',
          padding: '24px', // This matches the padding buffer
          borderRadius: '24px',
          border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.4)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          transform: 'none', // Reset any transforms
          maxHeight: 'none', // Remove constraints
          maxWidth: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      });

      if (blob) {
        navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]).then(() => {
          showToast(`✅ ${name} copiado al portapapeles`);
        }).catch((err) => {
          console.error(err);
          showToast("❌ Error al copiar (Navegador no soportado)");
        });
      } else {
        throw new Error("No se pudo generar la imagen");
      }
      setIsCapturing(false);

    } catch (error: any) {
      console.error("Capture failed:", error);
      showToast(`❌ Error: ${error.message || "Error desconocido al generar imagen"}`);
      setIsCapturing(false);
    }
  };

  const getBallGradient = () => {
    if (!hasSelectedPattern) return "bg-fuchsia-600";
    if (gameState.calledNumbers.length === 0 && !isSpinning) return "bg-amber-500";

    // If spinning, use the pending number to determine the color (Suspense Effect)
    if (isSpinning && pendingNumber) {
      const idx = getColIndex(pendingNumber);
      const theme = COLUMN_THEME[idx];
      if (theme.bg.includes('pink')) return "bg-pink-500";
      if (theme.bg.includes('amber')) return "bg-amber-500";
      if (theme.bg.includes('violet')) return "bg-violet-500";
      if (theme.bg.includes('orange')) return "bg-orange-500";
      if (theme.bg.includes('sky')) return "bg-sky-500";
      return "bg-rose-500";
    }

    if (gameState.lastNumber) {
      const idx = getColIndex(gameState.lastNumber);
      const theme = COLUMN_THEME[idx];
      if (theme.bg.includes('pink')) return "bg-pink-500";
      if (theme.bg.includes('amber')) return "bg-amber-500";
      if (theme.bg.includes('violet')) return "bg-violet-500";
      if (theme.bg.includes('orange')) return "bg-orange-500";
      if (theme.bg.includes('sky')) return "bg-sky-500";
      return "bg-rose-500";
    }

    return "bg-rose-500";
  };

  return (
    <div key={resetKey} className={`
        min-h-screen w-full p-4 md:p-6 overflow-x-hidden relative transition-colors duration-700
        ${darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-rose-50 selection:bg-fuchsia-500/40' : 'bg-gradient-to-br from-rose-200 via-pink-200 to-amber-100 text-slate-800 selection:bg-rose-200'}
    `}>

      {/* BACKGROUND ANIMATION CANVAS */}
      <BackgroundAnimation particleCount={bgParticleCount} speedMultiplier={bgSpeedMultiplier} darkMode={darkMode} />

      {/* Background Ambience - Adaptive */}
      <div className={`fixed top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[100px] pointer-events-none z-0 ${darkMode ? 'bg-purple-600/20' : 'bg-rose-500/30'}`} />
      <div className={`fixed bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full blur-[120px] pointer-events-none z-0 ${darkMode ? 'bg-rose-700/20' : 'bg-amber-400/30'}`} />

      <main className="max-w-[1600px] mx-auto relative z-10 flex flex-col gap-5 h-full">

        <ControlPanel
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          isGameStarted={isGameStarted}
          isConfigLocked={isConfigLocked}
          bgParticleCount={bgParticleCount}
          setBgParticleCount={setBgParticleCount}
          bgSpeedMultiplier={bgSpeedMultiplier}
          setBgSpeedMultiplier={setBgSpeedMultiplier}
          confirmReset={confirmReset}
          handleResetClick={handleResetClick}
          isMuted={isMuted}
          toggleMute={toggleMute}
        />

        {showGenerator && (
          <GeneratorPanel
            darkMode={darkMode}
            onClose={() => setShowGenerator(false)}
            cards={cards} // Pass state
            setCards={setCards}
            count={count}
            setCount={setCount}
            startId={startId}
            setStartId={setStartId}
          />
        )}

        {/* Main Grid Layout - 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT COLUMN: BALL + BUTTON + HISTORY (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-6 order-1">
            {/* 1. CURRENT BALL DISPLAY */}
            <GlassCard className="relative overflow-visible min-h-[300px] flex flex-col items-center justify-center" darkMode={darkMode}>

              <div className="relative z-10 scale-100 transform transition-all duration-500" style={{ perspective: '1000px' }}>
                {/* SPHERE CONTAINER */}
                <div className={`
                   w-48 h-48 rounded-full relative flex items-center justify-center
                   shadow-[0_20px_50px_rgba(0,0,0,0.3)] 
                   ${darkMode ? 'shadow-black/50' : 'shadow-rose-900/20'}
                 `}>
                  {/* 1. STATIC SPHERE BASE (Color + Lighting) */}
                  <div className={`
                       absolute inset-0 rounded-full
                       ${getBallGradient().replace('bg-gradient-to-br', '').replace('bg-gradient-to-tr', '')} 
                       bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4)_0%,rgba(0,0,0,0)_50%,rgba(0,0,0,0.4)_100%)]
                    `}
                    style={{
                      background: hasSelectedPattern
                        ? (isSpinning
                          ? `radial-gradient(circle at 30% 30%, #f472b6, #db2777, #831843)` // Pink spinning
                          : gameState.lastNumber
                            ? undefined // Let the class handle it if static
                            : `radial-gradient(circle at 30% 30%, #fbbf24, #d97706, #78350f)` // Orange/Gold default
                        )
                        : `radial-gradient(circle at 30% 30%, #e879f9, #c026d3, #701a75)` // Purple setup
                    }}
                  />

                  {/* 2. INNER SHADOW RING (Depth) */}
                  <div className="absolute inset-0 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.3),inset_10px_10px_20px_rgba(255,255,255,0.2)]" />

                  {/* 3. SPINNING CONTENT (Numbers) */}
                  <div className={`
                       w-full h-full flex items-center justify-center rounded-full
                       ${isSpinning ? 'animate-tumble' : 'animate-heartbeat-wave'}
                    `} style={{ transformStyle: 'preserve-3d' }}>
                    <BingoBall
                      hasSelectedPattern={hasSelectedPattern}
                      calledNumbersCount={gameState.calledNumbers.length}
                      isSpinning={isSpinning}
                      displayNumber={displayNumber}
                      lastNumber={gameState.lastNumber}
                    />
                  </div>

                  {/* 4. GLASS SHINE (Top Overlay) */}
                  <div className="absolute top-2 left-4 w-16 h-8 bg-gradient-to-b from-white/40 to-transparent rounded-full blur-md transform -rotate-45 pointer-events-none" />
                </div>
              </div>
            </GlassCard>

            {/* ACTION BUTTON OUTSIDE BALL CARD */}
            <div className="w-full relative z-20">
              <ActionButton
                onClick={handleDrawBall}
                disabled={isSpinning || !hasSelectedPattern || gameState.calledNumbers.length >= 75}
                label={isSpinning ? "Sorteando..." : "Sacar Balota"}
                icon={isSpinning ? <Trophy className="animate-spin" /> : <Play fill="currentColor" />}
              />
            </div>

            {/* 2. HISTORY - Fills remaining space */}
            <GlassCard
              className="flex-grow flex flex-col overflow-hidden min-h-[200px]"
              darkMode={darkMode}
            >
              <div className="flex items-center justify-between mb-4 px-1 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <History size={20} className="text-rose-500 drop-shadow-sm" />
                  <h3 className="font-black text-lg uppercase tracking-widest bg-gradient-to-r from-rose-600 via-rose-500 to-fuchsia-600 bg-clip-text text-transparent drop-shadow-sm">
                    Historial Reciente
                  </h3>
                </div>

                {/* Redesigned Ball Count Badge */}
                <div className={`
                  flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm border
                  ${darkMode
                    ? 'bg-white/10 border-white/10 text-rose-200'
                    : 'bg-white/60 border-white/40 text-rose-700'}
                `}>
                  <span className="opacity-70">Balotas:</span>
                  <span className={`
                    flex items-center justify-center min-w-[20px] h-5 rounded-full text-[10px]
                    ${darkMode ? 'bg-rose-500 text-white' : 'bg-rose-500 text-white'}
                  `}>
                    {Math.max(0, gameState.calledNumbers.length)}
                  </span>
                </div>
              </div>

              <HistoryList calledNumbers={gameState.calledNumbers} darkMode={darkMode} />
            </GlassCard>
          </div>

          {/* CENTER COLUMN: MASTER BOARD (6 cols) */}
          <div className="lg:col-span-6 order-2 h-full">
            <GlassCard id="master-board-card" className="h-full flex flex-col" darkMode={darkMode}>
              {/* Header matching History Card */}
              <div className="flex items-center justify-between mb-4 px-1 pb-2 border-b border-white/10 remove-me">
                <div className="flex items-center gap-2">
                  <LayoutGrid size={20} className="text-rose-500 drop-shadow-sm" />
                  <h3 className="font-black text-lg uppercase tracking-widest bg-gradient-to-r from-rose-600 via-rose-500 to-fuchsia-600 bg-clip-text text-transparent drop-shadow-sm">
                    Tablero Maestro
                  </h3>
                </div>
                <div className="flex gap-2">
                  {/* Optional: Add counters or status here if needed */}
                </div>
              </div>

              <MasterBoard
                calledNumbers={gameState.calledNumbers}
                lastNumber={gameState.lastNumber}
                darkMode={darkMode}
              />

              {/* Footer Actions for Board - Excluded from capture */}
              <div className="mt-auto pt-6 flex justify-center remove-me">
                <button
                  onClick={() => handleCapture('master-board-content', 'Tablero')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20 text-rose-200' : 'bg-white/40 hover:bg-white/60 text-rose-700'}`}
                >
                  <Send size={14} />
                  <span>Enviar Tablero</span>
                </button>
              </div>
            </GlassCard>
          </div>

          {/* RIGHT COLUMN: PATTERN (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-6 order-3">
            <GlassCard
              id="pattern-card"
              title="Figura a Jugar"
              icon={<Grid3X3 size={20} />}
              className={`${isLocked ? "opacity-90" : ""} pattern-card-container`}
              darkMode={darkMode}
              headerAction={
                <div className={`transition-all duration-300 ${isLocked ? 'text-rose-500 animate-pulse' : 'text-emerald-500/80'}`} title={isLocked ? "Figura Bloqueada" : "Configuración Habilitada"}>
                  {isLocked ? <Lock size={20} /> : <LockOpen size={20} />}
                </div>
              }
            >
              {/* Add a style block to hide the header during capture if targeting the card, 
                  but since we target inner content, we just need to make sure the inner content is clean.
                  However, GlassCard renders title internally. 
                  We are capturing 'pattern-grid-content' which is INSIDE GlassCard, 
                  so the GlassCard title won't be captured anyway. 
                  But we should verify if GlassCard wraps children in a way that affects this.
              */}

              <PatternGrid
                pattern={gameState.pattern}
                togglePatternCell={handleTogglePattern}
                darkMode={darkMode}
                isLocked={isLocked}
              />

              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => handleCapture('pattern-grid-content', 'Figura')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20 text-rose-200' : 'bg-white/40 hover:bg-white/60 text-rose-700'}`}
                >
                  <Send size={14} />
                  <span>Enviar Figura</span>
                </button>
              </div>
            </GlassCard>

            <div className="mt-4 w-full">
              <ActionButton
                onClick={() => setShowGenerator(true)}
                label="CARTONES"
                icon={<Table size={24} />}
              />
            </div>
          </div>

        </div>
      </main >

      {/* CREDITS LOGO */}
      <a
        href="https://www.linkedin.com/in/alarcone1/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-50 group flex items-center gap-2 cursor-pointer"
      >
        <span className={`text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 ${darkMode ? 'text-white/50' : 'text-slate-500'}`}>
          Créditos
        </span>
        <img
          src="/icons/Logo-ae1.png"
          alt="Créditos"
          className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-6 active:scale-90"
        />
      </a>

      {/* TOAST NOTIFICATION */}
      < div className={`
        fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[100]
        transition-all duration-500 ease-in-out
        ${toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}
      `}>
        <div className={`
            px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border backdrop-blur-md
            ${darkMode ? 'bg-slate-800/90 border-slate-700 text-white' : 'bg-white/90 border-white/50 text-slate-800'}
        `}>
          <AlertCircle size={20} className={darkMode ? "text-rose-400" : "text-rose-500"} />
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      </div >

    </div >
  );
}
