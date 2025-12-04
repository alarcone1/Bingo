import React from 'react';
import { Sparkles, Minus, Plus, Sun, Moon, Trash2, RotateCcw } from 'lucide-react';

interface ControlPanelProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    isGameStarted: boolean;
    isConfigLocked: boolean;
    bgParticleCount: number;
    setBgParticleCount: (count: number) => void;
    bgSpeedMultiplier: number;
    setBgSpeedMultiplier: (speed: number) => void;
    confirmReset: boolean;
    handleResetClick: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
    darkMode,
    toggleDarkMode,
    isGameStarted,
    isConfigLocked,
    bgParticleCount,
    setBgParticleCount,
    bgSpeedMultiplier,
    setBgSpeedMultiplier,
    confirmReset,
    handleResetClick
}) => {
    return (
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
    );
};
