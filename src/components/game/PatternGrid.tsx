import React from 'react';
import { Grid3X3, Check } from 'lucide-react';

interface PatternGridProps {
    pattern: boolean[];
    togglePatternCell: (index: number) => void;
    darkMode: boolean;
    isLocked: boolean;
}

import { COLUMNS, COLUMN_THEME } from '../../utils/constants';

export const PatternGrid: React.FC<PatternGridProps> = ({ pattern, togglePatternCell, darkMode, isLocked }) => {
    return (
        <div id="pattern-grid-content" className="flex flex-col items-center">
            {/* BINGO Header matching MasterBoard */}
            <div className="grid grid-cols-5 gap-2 mb-2 w-full max-w-[280px]">
                {COLUMNS.map((letter, colIndex) => {
                    const theme = COLUMN_THEME[colIndex];
                    return (
                        <div key={letter} className={`text-center font-black text-xl bg-clip-text text-transparent bg-gradient-to-b ${theme.gradientText} drop-shadow-sm filter`}>
                            {letter}
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-5 gap-2 aspect-square w-full max-w-[280px]">
                {pattern.map((active, i) => (
                    <button
                        key={i}
                        onClick={() => togglePatternCell(i)}
                        disabled={isLocked}
                        className={`
            w-full h-full rounded-lg border-2 transition-all duration-300 flex items-center justify-center aspect-square
            ${active
                                ? 'bg-gradient-to-br from-rose-500 to-fuchsia-600 border-rose-300 shadow-lg shadow-rose-500/40 scale-105 z-10'
                                : darkMode
                                    ? 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30'
                                    : 'bg-white/60 border-white/80 hover:bg-white/80 hover:border-white'
                            }
            ${isLocked && !active ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
          `}
                    >
                        {active && <Check size={20} className="text-white drop-shadow-md" strokeWidth={3} />}
                    </button>
                ))}
            </div>
        </div>
    );
};
