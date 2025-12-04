import React from 'react';
import { COLUMNS, COLUMN_THEME } from '../../utils/constants';

interface MasterBoardProps {
    calledNumbers: number[];
    lastNumber: number | null;
    darkMode: boolean;
}

export const MasterBoard: React.FC<MasterBoardProps> = ({ calledNumbers, lastNumber, darkMode }) => {
    return (
        <div id="master-board-grid" className={`flex justify-center items-start pt-2 px-2 rounded-3xl ${darkMode ? 'bg-white/5' : 'bg-white/10'}`}>
            <div id="master-board-content" className="grid grid-cols-5 gap-x-3 gap-y-1 w-fit">
                {COLUMNS.map((letter, colIndex) => {
                    const theme = COLUMN_THEME[colIndex];

                    return (
                        <div key={letter} className="flex flex-col gap-[2px] items-center">
                            <div className={`text-center font-black text-3xl bg-clip-text text-transparent bg-gradient-to-b ${theme.gradientText} pb-2 drop-shadow-sm filter mb-1`}>
                                {letter}
                            </div>

                            {Array.from({ length: 15 }, (_, i) => {
                                const num = colIndex * 15 + i + 1;
                                const isCalled = calledNumbers.includes(num);
                                const isLast = lastNumber === num;

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
