
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { 
  X, 
  RotateCcw, 
  Play, 
  Sparkles, 
  Trophy,
  Grid3X3,
  Check,
  AlertCircle,
  History,
  LayoutDashboard,
  Send,
  Lock,
  Loader2,
  Trash2,
  Minus,
  Plus,
  Moon,
  Sun
} from 'lucide-react';

// Declare html2canvas for TS
declare var html2canvas: any;

// --- Types & Constants ---

type GameStatus = 'SETUP' | 'PLAYING';

interface GameState {
  status: GameStatus;
  calledNumbers: number[];
  pattern: boolean[]; // Array of 25 booleans (5x5)
  lastNumber: number | null;
  timestamp: number;
}

const STORAGE_KEY = 'bingo-rose-gold-state';
const DARK_MODE_KEY = 'bingo-ely-dark-mode';
const TOTAL_NUMBERS = 75;
const COLUMNS = ['B', 'I', 'N', 'G', 'O'];

// Helper to get column index (0-4) from number
const getColIndex = (num: number) => Math.ceil(num / 15) - 1;

// Range helper: B (1-15), I (16-30), etc.
const getColumnForNumber = (num: number) => COLUMNS[getColIndex(num)];

// --- COLOR THEMES FOR COLUMNS (Jewel Tones Revised) ---
// Added textDark for better contrast in Dark Mode
const COLUMN_THEME = [
  // B - Pink/Rose (Matches "Enviar Figura" Button)
  {
    text: 'text-pink-600',
    textDark: 'text-pink-400',
    bg: 'bg-pink-500',
    border: 'border-pink-200',
    borderDark: 'border-pink-800',
    gradientText: 'from-rose-500 to-pink-600',
    gradientBg: 'from-rose-400 to-pink-500',
    shadow: 'shadow-pink-300/50'
  },
  // I - Gold/Yellow (Brighter to contrast with Orange)
  {
    text: 'text-amber-600',
    textDark: 'text-amber-400',
    bg: 'bg-amber-400',
    border: 'border-amber-200',
    borderDark: 'border-amber-800',
    gradientText: 'from-amber-500 to-yellow-600',
    gradientBg: 'from-yellow-400 to-amber-500',
    shadow: 'shadow-amber-300/50'
  },
  // N - Violet/Amethyst
  {
    text: 'text-violet-600',
    textDark: 'text-violet-400',
    bg: 'bg-violet-500',
    border: 'border-violet-200',
    borderDark: 'border-violet-800',
    gradientText: 'from-violet-500 to-purple-700',
    gradientBg: 'from-violet-400 to-purple-600',
    shadow: 'shadow-violet-300/50'
  },
  // G - Orange/Sunset (Requested)
  {
    text: 'text-orange-600',
    textDark: 'text-orange-400',
    bg: 'bg-orange-500',
    border: 'border-orange-200',
    borderDark: 'border-orange-800',
    gradientText: 'from-orange-500 to-red-600',
    gradientBg: 'from-orange-400 to-red-500',
    shadow: 'shadow-orange-300/50'
  },
  // O - Sky Blue/Topaz (Replaces Fuchsia to balance the palette with a cool tone)
  {
    text: 'text-sky-600',
    textDark: 'text-sky-400',
    bg: 'bg-sky-500',
    border: 'border-sky-200',
    borderDark: 'border-sky-800',
    gradientText: 'from-sky-500 to-blue-600',
    gradientBg: 'from-sky-400 to-blue-500',
    shadow: 'shadow-sky-300/50'
  }
];

// --- Animation Component ---

interface AnimationProps {
  particleCount: number;
  speedMultiplier: number;
  darkMode: boolean;
}

// Particle Class Definition
class Particle {
  x: number;
  y: number;
  dirX: number; 
  dirY: number; 
  radius: number;
  baseRadius: number;
  color: { r: number, g: number, b: number };
  phase: number;
  pulseSpeed: number;

  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.dirX = (Math.random() - 0.5);
    this.dirY = (Math.random() - 0.5);
    this.baseRadius = Math.random() * 20 + 15; 
    this.radius = this.baseRadius;
    
    const COLORS = [
      { r: 236, g: 72, b: 153 },  // Pink (B)
      { r: 251, g: 191, b: 36 },  // Amber/Gold (I)
      { r: 139, g: 92, b: 246 },  // Violet (N)
      { r: 249, g: 115, b: 22 },  // Orange (G)
      { r: 14, g: 165, b: 233 }   // Sky Blue (O)
    ];
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    this.phase = Math.random() * Math.PI * 2;
    this.pulseSpeed = 0.02 + Math.random() * 0.02;
  }

  update(w: number, h: number, speedMult: number) {
    this.x += this.dirX * speedMult;
    this.y += this.dirY * speedMult;

    if (this.x < -this.radius || this.x > w + this.radius) this.dirX *= -1;
    if (this.y < -this.radius || this.y > h + this.radius) this.dirY *= -1;

    // Bounds safety
    if (this.x < -100) this.x = w + 90;
    if (this.x > w + 100) this.x = -90;
    if (this.y < -100) this.y = h + 90;
    if (this.y > h + 100) this.y = -90;

    this.phase += this.pulseSpeed;
    this.radius = this.baseRadius + Math.sin(this.phase) * 5;
  }

  draw(ctx: CanvasRenderingContext2D, darkMode: boolean) {
    const { r, g, b } = this.color;
    
    // Adjust opacity for dark mode (make them glow more)
    const opacityCenter = darkMode ? 0.8 : 0.9;
    const opacityEdge = darkMode ? 0.1 : 0.2;

    const gradient = ctx.createRadialGradient(
      this.x - this.radius * 0.3, 
      this.y - this.radius * 0.3, 
      this.radius * 0.1, 
      this.x, 
      this.y, 
      this.radius
    );
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacityCenter})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${opacityEdge})`);

    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0, this.radius), 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

const BackgroundAnimation: React.FC<AnimationProps> = ({ particleCount, speedMultiplier, darkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationIdRef = useRef<number>(0);
  const speedRef = useRef(speedMultiplier);
  const darkModeRef = useRef(darkMode);

  useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    darkModeRef.current = darkMode;
  }, [darkMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    const currentLength = particlesRef.current.length;
    const targetLength = particleCount;

    if (targetLength > currentLength) {
        for (let i = 0; i < targetLength - currentLength; i++) {
            particlesRef.current.push(new Particle(canvas.width, canvas.height));
        }
    } else if (targetLength < currentLength) {
        particlesRef.current.splice(targetLength);
    }
  }, [particleCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const CONNECTION_DISTANCE = 280;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (particlesRef.current.length === 0) {
        for (let i = 0; i < particleCount; i++) {
            particlesRef.current.push(new Particle(canvas.width, canvas.height));
        }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = darkModeRef.current;
      
      particlesRef.current.forEach(p => {
        p.update(canvas.width, canvas.height, speedRef.current);
        p.draw(ctx, isDark);
      });

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const opacity = 1 - (dist / CONNECTION_DISTANCE);
            
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            // Lighter lines in dark mode
            const alphaMult = isDark ? 0.4 : 0.6;
            
            gradient.addColorStop(0, `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, ${opacity * alphaMult})`);
            gradient.addColorStop(1, `rgba(${p2.color.r}, ${p2.color.g}, ${p2.color.b}, ${opacity * alphaMult})`);
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3 * opacity; 
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationIdRef.current);
    };
  }, []); 

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// --- Components ---

/**
 * GlassCard: Adapted for Dark Mode
 */
const GlassCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  id?: string;
  darkMode?: boolean;
}> = ({ children, className = '', title, icon, id, darkMode = false }) => (
  <div id={id} className={`
    ${darkMode ? 'bg-black/40 border-white/10 shadow-black/50 hover:bg-black/50' : 'bg-white/40 border-white/60 shadow-xl hover:bg-white/50'}
    backdrop-blur-xl border 
    rounded-3xl p-6 relative 
    transition-all duration-300 hover:shadow-2xl 
    ${className.includes('overflow-visible') ? '' : 'overflow-hidden'}
    ${className}
  `}>
    {/* Shine */}
    <div className={`absolute top-0 left-0 w-full h-full pointer-events-none rounded-3xl ${darkMode ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-white/40 to-transparent'}`} />
    
    {(title || icon) && (
      <div className={`flex items-center gap-3 mb-4 z-10 relative pb-2 border-b header-container ${darkMode ? 'border-white/10' : 'border-rose-100/50'}`}>
        {icon && <div className="text-rose-500 drop-shadow-sm icon-elem">{icon}</div>}
        {title && (
          <h2 className="font-black text-lg uppercase tracking-widest bg-gradient-to-r from-rose-600 via-rose-500 to-fuchsia-600 bg-clip-text text-transparent drop-shadow-sm title-text">
            {title}
          </h2>
        )}
      </div>
    )}
    <div className="relative z-10 h-full">{children}</div>
  </div>
);

const ActionButton: React.FC<{
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}> = ({ onClick, label, icon, variant = 'primary', disabled = false }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none w-full";
  
  const variants = {
    primary: "bg-gradient-to-r from-rose-400 to-fuchsia-500 text-white hover:from-rose-500 hover:to-fuchsia-600 shadow-rose-300/50",
    secondary: "bg-white/60 text-rose-700 hover:bg-white/80 border border-white", // Used rarely
    danger: "bg-gradient-to-r from-red-400 to-red-600 text-white hover:from-red-500 hover:to-red-700 shadow-red-300/50"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
};

// --- Main Application ---

export default function App() {
  const [resetKey, setResetKey] = useState(0);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(DARK_MODE_KEY) === 'true';
    }
    return false;
  });

  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
    return {
      status: 'SETUP',
      calledNumbers: [],
      pattern: Array(25).fill(false),
      lastNumber: null,
      timestamp: Date.now()
    };
  });

  const [toast, setToast] = useState<{message: string, visible: boolean}>({ message: '', visible: false });
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayNumber, setDisplayNumber] = useState<number | null>(null);
  
  const [bgParticleCount, setBgParticleCount] = useState(18);
  const [bgSpeedMultiplier, setBgSpeedMultiplier] = useState(0.8);

  const [confirmReset, setConfirmReset] = useState(false);

  // --- Effects ---
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem(DARK_MODE_KEY, String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (!isSpinning) {
      setDisplayNumber(gameState.lastNumber);
    }
  }, [gameState.lastNumber, isSpinning]);

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

  // --- Actions ---

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ ...toast, visible: false }), 3000);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const drawBall = () => {
    if (gameState.calledNumbers.length >= TOTAL_NUMBERS) {
      showToast("¡Se han sacado todas las balotas!");
      return;
    }
    
    if (!hasSelectedPattern) {
      showToast("⚠️ Debes dibujar una figura primero en el panel derecho");
      return;
    }

    if (isSpinning) return;

    setIsSpinning(true);
    
    let nextNum: number;
    do {
      nextNum = Math.floor(Math.random() * TOTAL_NUMBERS) + 1;
    } while (gameState.calledNumbers.includes(nextNum));

    const shuffleInterval = setInterval(() => {
      const randomDisplay = Math.floor(Math.random() * TOTAL_NUMBERS) + 1;
      setDisplayNumber(randomDisplay);
    }, 80);

    setTimeout(() => {
      clearInterval(shuffleInterval);
      setIsSpinning(false);
      
      setGameState(prev => ({
        ...prev,
        status: 'PLAYING',
        calledNumbers: [nextNum, ...prev.calledNumbers],
        lastNumber: nextNum,
        timestamp: Date.now()
      }));
    }, 3000);
  };

  const handleResetClick = () => {
    if (!confirmReset) {
        setConfirmReset(true);
        return;
    }
    
    localStorage.removeItem(STORAGE_KEY);
    const freshState: GameState = {
        status: 'SETUP',
        calledNumbers: [],
        pattern: Array(25).fill(false),
        lastNumber: null,
        timestamp: Date.now()
    };
    setGameState(freshState);
    setIsSpinning(false);
    setDisplayNumber(null);
    setConfirmReset(false);
    setResetKey(prev => prev + 1);
    showToast("✨ Juego reiniciado completamente");
  };

  const togglePatternCell = (index: number) => {
    if (isLocked) {
        showToast("🔒 No puedes cambiar la figura durante el juego");
        return;
    }
    const newPattern = [...gameState.pattern];
    newPattern[index] = !newPattern[index];
    setGameState(prev => ({ ...prev, pattern: newPattern }));
  };

  const handleCapture = async (elementId: string, name: string) => {
    if (isCapturing) return;
    setIsCapturing(true);
    showToast(`⏳ Generando imagen de ${name}...`);

    try {
        const element = document.getElementById(elementId);
        if (!element) throw new Error("Element not found");

        const canvas = await html2canvas(element, {
            // Adaptive background color for screenshot
            backgroundColor: darkMode ? '#0f172a' : '#fff1f2', 
            scale: 2, 
            useCORS: true,
            onclone: (clonedDoc: Document) => {
                const gradientTexts = clonedDoc.querySelectorAll('.bg-clip-text');
                gradientTexts.forEach((el: any) => {
                    el.classList.remove('text-transparent', 'bg-clip-text', 'bg-gradient-to-r');
                    // Adaptive fallback color
                    el.style.color = darkMode ? '#fb7185' : '#be123c';
                    el.style.webkitTextFillColor = darkMode ? '#fb7185' : '#be123c';
                    el.style.backgroundImage = 'none';
                });
                
                const gridHeaders = clonedDoc.querySelectorAll('.grid .text-transparent');
                gridHeaders.forEach((el: any) => {
                    el.classList.remove('text-transparent', 'bg-clip-text');
                    el.style.color = darkMode ? '#fb7185' : '#be123c'; 
                    el.style.webkitTextFillColor = darkMode ? '#fb7185' : '#be123c';
                });
            }
        });

        canvas.toBlob((blob: Blob) => {
            if (blob) {
                navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]).then(() => {
                    showToast(`✅ ${name} copiado al portapapeles`);
                }).catch((err) => {
                    console.error(err);
                    showToast("❌ Error al copiar (Navegador no soportado)");
                });
            }
            setIsCapturing(false);
        }, 'image/png');

    } catch (error) {
        console.error("Capture failed:", error);
        showToast("❌ Error al generar la imagen");
        setIsCapturing(false);
    }
  };

  // --- Render Helpers ---

  const renderMasterBoard = () => {
    return (
      <div id="master-board-grid" className={`flex justify-center h-full items-center py-4 px-2 rounded-3xl ${darkMode ? 'bg-white/5' : 'bg-white/10'}`}>
        <div className="grid grid-cols-5 gap-x-3 gap-y-1 w-fit"> 
          {COLUMNS.map((letter, colIndex) => {
            const theme = COLUMN_THEME[colIndex];
            
            return (
              <div key={letter} className="flex flex-col gap-[2px] items-center">
                <div className={`text-center font-black text-3xl bg-clip-text text-transparent bg-gradient-to-b ${theme.gradientText} pb-2 drop-shadow-sm filter mb-1`}>
                  {letter}
                </div>
                
                {Array.from({ length: 15 }, (_, i) => {
                  const num = colIndex * 15 + i + 1;
                  const isCalled = gameState.calledNumbers.includes(num);
                  const isLast = gameState.lastNumber === num;

                  return (
                    <div
                      key={num}
                      className={`
                        w-10 h-10 flex items-center justify-center rounded-full text-[13px] font-bold leading-none transition-all duration-500
                        ${isLast 
                          ? `bg-gradient-to-tr ${theme.gradientBg} text-white shadow-lg ${theme.shadow} scale-125 z-20 animate-soft-pulse ring-2 ring-white` 
                          : isCalled 
                            ? `bg-gradient-to-br ${theme.gradientBg} text-white shadow-sm opacity-90` 
                            : darkMode ? 'bg-white/5 text-rose-100/20' : 'bg-white/40 text-rose-900/40' // Adaptive inactive state
                        }
                      `}
                    >
                      {num}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderBallContent = () => {
    if (!hasSelectedPattern) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full animate-pulse text-center">
           <span className="text-4xl font-black text-white drop-shadow-lg block">¿FIGURA?</span>
           <span className="text-[10px] text-white/90 font-bold mt-1 block tracking-wide drop-shadow-sm uppercase">Definir Primero</span>
        </div>
      );
    }

    if (gameState.calledNumbers.length === 0 && !isSpinning) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full text-center">
           <span className="text-2xl font-black text-white leading-tight drop-shadow-lg block">Primera<br/>Balota</span>
           <span className="text-xs text-white/90 mt-1 block font-medium drop-shadow-sm">Lista para jugar</span>
        </div>
      );
    }

    const numToShow = isSpinning ? displayNumber : gameState.lastNumber;
    
    if (numToShow) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full text-center">
          <span className="text-3xl font-black text-white/90 mb-0 block drop-shadow-md">
            {getColumnForNumber(numToShow)}
          </span>
          <span className={`text-7xl font-black text-white drop-shadow-xl block leading-none ${isSpinning ? 'blur-[1px]' : ''}`}>
            {numToShow}
          </span>
        </div>
      );
    }

    return null;
  };

  const getBallGradient = () => {
    if (!hasSelectedPattern) return "bg-gradient-to-br from-fuchsia-600 via-rose-500 to-orange-400"; 
    if (gameState.calledNumbers.length === 0 && !isSpinning) return "bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500"; 
    
    if (isSpinning) return "bg-gradient-to-br from-rose-400 via-fuchsia-500 to-purple-500";

    if (gameState.lastNumber) {
        const idx = getColIndex(gameState.lastNumber);
        const theme = COLUMN_THEME[idx];
        return `bg-gradient-to-br ${theme.gradientBg}`;
    }

    return "bg-gradient-to-br from-rose-400 via-fuchsia-500 to-purple-500";
  };

  // --- Main Render ---

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

      <main className="max-w-7xl mx-auto relative z-10 flex flex-col gap-5 h-full">
        
        {/* Header */}
        <header className="flex flex-wrap justify-between items-center px-2 gap-4 relative z-50">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-rose-400 to-fuchsia-500 rounded-2xl shadow-lg text-white">
                <Sparkles size={24} />
                </div>
                <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-700 to-fuchsia-700">
                    Bingo ELY
                </h1>
                <p className={`${darkMode ? 'text-rose-200/50' : 'text-rose-900/50'} text-sm font-medium`}>Panel de Anfitrión</p>
                </div>
            </div>

            {/* STATUS PILL */}
            <div className={`
                hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-sm transition-colors duration-500 ml-4
                ${isGameStarted
                    ? (darkMode ? 'bg-black/40 border-rose-800 text-rose-300' : 'bg-white/60 border-rose-200 text-rose-700')
                    : (darkMode ? 'bg-white/5 border-white/10 text-rose-200/50' : 'bg-white/40 border-white/50 text-rose-900/50')
                }
                `}>
                <div className={`w-2 h-2 rounded-full ${isGameStarted ? 'bg-rose-500 animate-pulse' : 'bg-yellow-500'}`} />
                <span className="text-xs font-bold uppercase tracking-wider">
                    {isGameStarted ? 'En Juego' : 'Configuración'}
                </span>
            </div>

            {/* CONFIGURATION SLIDERS */}
            <div className={`
               flex items-center gap-6 ml-4 px-5 py-2 rounded-full border transition-all duration-500
               ${darkMode ? 'bg-black/30 border-white/10' : 'bg-white/30 border-white/40'}
               ${isConfigLocked ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100'}
            `}>
               {/* Particle Count Slider */}
               <div className="flex flex-col w-28">
                  <label className={`text-[9px] font-bold uppercase tracking-wide mb-1 flex justify-between ${darkMode ? 'text-rose-300' : 'text-rose-700'}`}>
                     <span>Balotas</span>
                     <span>{bgParticleCount}</span>
                  </label>
                  <div className="flex items-center gap-2">
                     <Minus size={10} className="text-rose-600" />
                     <input 
                        type="range" 
                        min="5" 
                        max="40" 
                        disabled={isConfigLocked}
                        value={bgParticleCount} 
                        onChange={(e) => setBgParticleCount(parseInt(e.target.value))}
                        className={`w-full accent-rose-500 h-1.5 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed ${darkMode ? 'bg-rose-900/50' : 'bg-rose-300/80'}`}
                     />
                     <Plus size={10} className="text-rose-600" />
                  </div>
               </div>
               
               {/* Speed Slider */}
               <div className="flex flex-col w-28">
                  <label className={`text-[9px] font-bold uppercase tracking-wide mb-1 flex justify-between ${darkMode ? 'text-amber-300' : 'text-rose-700'}`}>
                     <span>Velocidad</span>
                     <span>{bgSpeedMultiplier}x</span>
                  </label>
                  <div className="flex items-center gap-2">
                     <Minus size={10} className="text-amber-600" />
                     <input 
                        type="range" 
                        min="0.2" 
                        max="3" 
                        step="0.1"
                        disabled={isConfigLocked}
                        value={bgSpeedMultiplier} 
                        onChange={(e) => setBgSpeedMultiplier(parseFloat(e.target.value))}
                        className={`w-full accent-amber-500 h-1.5 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed ${darkMode ? 'bg-amber-900/50' : 'bg-amber-300/80'}`}
                     />
                     <Plus size={10} className="text-amber-600" />
                  </div>
               </div>
            </div>

          </div>
          
          <div className="flex items-center gap-3">
             {/* Dark Mode Toggle */}
             <button
                onClick={toggleDarkMode}
                className={`
                    w-10 h-10 rounded-full flex items-center justify-center border transition-all hover:scale-105 active:scale-95
                    ${darkMode 
                        ? 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700 shadow-lg shadow-purple-900/20' 
                        : 'bg-white/60 text-slate-600 border-white/50 hover:bg-white/80 shadow-sm'
                    }
                `}
                title={darkMode ? "Modo Claro" : "Modo Oscuro"}
             >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>

             {/* Reset Button */}
             <button 
                onClick={handleResetClick}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold transition-all active:scale-95 shadow-sm
                    ${confirmReset 
                        ? 'bg-rose-600 text-white border-rose-700 hover:bg-rose-700 animate-pulse' 
                        : (darkMode 
                            ? 'bg-white/10 text-rose-300 hover:bg-white/20 border-white/10' 
                            : 'bg-white/40 text-rose-700 hover:bg-white/60 border-white/50')
                    }
                `}
              >
                {confirmReset ? <Trash2 size={16} /> : <RotateCcw size={16} />}
                <span className="hidden sm:inline">{confirmReset ? '¿Seguro?' : 'Reiniciar'}</span>
              </button>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column */}
          <section className="lg:col-span-3 flex flex-col gap-6 sticky top-4">
            
            {/* Current Ball Sphere */}
            <GlassCard className="py-10 relative overflow-visible min-h-[300px]" darkMode={darkMode}>
               <div className="w-full flex flex-col items-center justify-center">
                 
                 <div className="relative group cursor-default mx-auto">
                    {hasSelectedPattern && (
                        <div className={`absolute -inset-4 rounded-full blur-xl ${isSpinning ? 'animate-spin opacity-50' : 'animate-pulse'} ${darkMode ? 'bg-fuchsia-900/40' : 'bg-fuchsia-400/30'}`}></div>
                    )}
                    
                    <div className={`
                      w-48 h-48 rounded-full 
                      ${getBallGradient()}
                      flex flex-col items-center justify-center 
                      shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] 
                      border-[8px] border-white ring-4 ring-white/30
                      relative overflow-hidden
                      transition-all duration-700
                      ${isSpinning ? 'scale-105' : 'animate-soft-pulse'}
                    `}>
                      
                      <div className="absolute top-4 left-8 w-16 h-8 bg-gradient-to-b from-white to-white/0 rounded-full rotate-[-45deg] opacity-70 blur-[1px] z-20"></div>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-10 bg-white/20 rounded-[100%] blur-md"></div>

                      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                        {renderBallContent()}
                      </div>
                    </div>
                 </div>

                 <div className="mt-8 w-full">
                   <ActionButton 
                     onClick={drawBall} 
                     label={isSpinning ? "Girando..." : "Sacar Balota"}
                     icon={<Play size={20} fill="currentColor" />}
                     disabled={gameState.calledNumbers.length >= TOTAL_NUMBERS || !hasSelectedPattern || isSpinning}
                   />
                   {!hasSelectedPattern && (
                     <div className="flex items-center justify-center gap-2 mt-3 text-rose-500 text-xs font-bold animate-pulse">
                       <AlertCircle size={14} />
                       <span>Dibuja la figura ganadora primero</span>
                     </div>
                   )}
                 </div>
               
               </div>
            </GlassCard>

            {/* History Bubbles */}
            <GlassCard title="Historial" icon={<History size={20} />} className="min-h-[200px]" darkMode={darkMode}>
               <div className="flex flex-wrap gap-2 justify-center content-start max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                {gameState.calledNumbers.length === 0 ? (
                   <p className={`${darkMode ? 'text-rose-200/20' : 'text-rose-900/30'} text-xs italic py-8 text-center w-full`}>
                     Las balotas aparecerán aquí
                   </p>
                ) : (
                  gameState.calledNumbers.map((num, idx) => {
                    const colIdx = getColIndex(num);
                    const theme = COLUMN_THEME[colIdx];
                    return (
                      <div key={`${num}-${idx}`} className="flex flex-col items-center animate-in fade-in zoom-in duration-300 mb-1">
                        <div className={`
                            w-9 h-9 rounded-full border flex items-center justify-center font-bold shadow-sm 
                            ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} 
                            ${darkMode ? theme.textDark : theme.text} 
                            ${darkMode ? theme.borderDark : theme.border}
                        `}>
                          {num}
                        </div>
                        <span className={`text-[10px] font-black mt-0.5 tracking-wider ${darkMode ? theme.textDark : theme.text}`}>
                          {COLUMNS[colIdx]}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </GlassCard>
          </section>

          {/* Center Column: Master Board */}
          <section className="lg:col-span-6 h-full flex flex-col">
            <GlassCard id="board-panel" title="Tablero Maestro" icon={<Grid3X3 size={20}/>} className="flex-grow flex flex-col items-center justify-center" darkMode={darkMode}>
                <div className={`w-fit flex justify-center items-center rounded-3xl p-6 shadow-inner border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-white/20 border-white/40'}`}>
                   {renderMasterBoard()}
                </div>
            </GlassCard>
          </section>

          {/* Right Column */}
          <section className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Pattern Editor */}
            <GlassCard id="pattern-panel" title="Figura Objetivo" icon={<Trophy size={20} />} darkMode={darkMode}>
               <div className="flex justify-between items-start mb-4">
                 <p className={`${darkMode ? 'text-rose-200/50' : 'text-rose-900/60'} text-xs leading-relaxed max-w-[70%]`}>
                   {isLocked ? "Figura bloqueada durante el juego." : "Dibuja el patrón ganador."}
                 </p>
                 {isLocked ? (
                    <Lock size={14} className="text-rose-500" />
                 ) : (
                    <button 
                        onClick={() => setGameState(prev => ({ ...prev, pattern: Array(25).fill(false) }))}
                        className="text-[10px] text-rose-500 underline hover:text-rose-700"
                    >
                        Limpiar
                    </button>
                 )}
               </div>
               
               <div className={`w-full rounded-xl p-3 shadow-inner border mx-auto max-w-[240px] relative transition-all duration-300 ${isLocked ? 'opacity-90' : ''} ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/30 border-white/50'}`}>
                 
                 {isLocked && <div className="absolute inset-0 z-20 cursor-not-allowed" onClick={() => showToast("🔒 Figura bloqueada en juego")}></div>}

                 <div className="flex flex-col w-full">
                    {/* BINGO Header for Pattern */}
                    <div className="grid grid-cols-5 gap-2 mb-2 w-full">
                        {COLUMNS.map((letter, i) => (
                            <div key={i} className={`text-center font-black text-xs drop-shadow-sm ${darkMode ? COLUMN_THEME[i].textDark : COLUMN_THEME[i].text}`}>{letter}</div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-5 gap-2 w-full">
                    {gameState.pattern.map((isActive, idx) => (
                        <button
                        key={idx}
                        onClick={() => togglePatternCell(idx)}
                        className={`
                            aspect-square rounded-md flex items-center justify-center transition-all duration-200 border-2 w-full
                            ${isActive 
                                ? 'bg-gradient-to-br from-rose-400 to-fuchsia-500 border-rose-400 shadow-md' 
                                : (darkMode ? 'bg-white/10 border-white/5 hover:bg-white/20' : 'bg-white/40 border-rose-200/50 hover:bg-white/60')
                            }
                            ${isLocked ? 'cursor-not-allowed saturate-50' : ''}
                        `}
                        >
                        {isActive && <X size={20} className="text-white animate-in zoom-in" strokeWidth={3} />}
                        </button>
                    ))}
                    </div>
                 </div>
               </div>
            </GlassCard>

            {/* Management */}
            <GlassCard title="Gestión" icon={<LayoutDashboard size={20} />} darkMode={darkMode}>
               
               {/* Progress Counter */}
               <div className={`mb-6 flex flex-col items-center justify-center p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/30 border-white/50'}`}>
                  <span className={`text-xs uppercase font-bold tracking-widest mb-1 ${darkMode ? 'text-rose-200/40' : 'text-rose-900/50'}`}>Balotas Jugadas</span>
                  <div className="flex items-baseline gap-1">
                     <span className="text-4xl font-black text-rose-600 drop-shadow-sm">{gameState.calledNumbers.length}</span>
                     <span className="text-lg text-rose-400 font-bold">/ 75</span>
                  </div>
               </div>

               {/* Button Group */}
               <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleCapture('pattern-panel', 'Figura')}
                    disabled={isCapturing}
                    className="w-full py-3 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white rounded-xl shadow-lg shadow-rose-200 transition-all transform active:scale-95 flex items-center justify-center gap-3 font-bold text-base disabled:opacity-50"
                  >
                     {isCapturing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                     <span>Enviar Figura</span>
                  </button>

                  <button 
                    onClick={() => handleCapture('board-panel', 'Tablero')}
                    disabled={isCapturing}
                    className="w-full py-3 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-fuchsia-200 transition-all transform active:scale-95 flex items-center justify-center gap-3 font-bold text-base disabled:opacity-50"
                  >
                    {isCapturing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    <span>Enviar Tablero</span>
                  </button>
               </div>
               
               <p className={`text-center text-[10px] leading-tight mt-4 ${darkMode ? 'text-rose-200/20' : 'text-rose-900/30'}`}>
                 Copia una imagen al portapapeles para pegar en WhatsApp.
               </p>
            </GlassCard>

          </section>

        </div>
      </main>

      {/* Toast Notification */}
      <div className={`
        fixed bottom-6 left-1/2 transform -translate-x-1/2 
        backdrop-blur text-white px-6 py-3 rounded-full shadow-2xl
        flex items-center gap-3 z-50 transition-all duration-500
        ${toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
        ${darkMode ? 'bg-fuchsia-900/90' : 'bg-gray-900/90'}
      `}>
        <Check size={18} className="text-green-400" />
        <span className="text-sm font-medium">{toast.message}</span>
      </div>

    </div>
  );
}
