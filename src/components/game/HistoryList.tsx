import React from 'react';
import { getColumnForNumber, COLUMN_THEME, getColIndex } from '../../utils/constants';

interface HistoryListProps {
    calledNumbers: number[];
    darkMode: boolean;
}

export const HistoryList: React.FC<HistoryListProps> = ({ calledNumbers, darkMode }) => {
    return (
        <div className="flex flex-wrap gap-2 justify-center content-start h-full overflow-y-auto custom-scrollbar pr-2">
            {calledNumbers.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                    <span className={`text-sm italic ${darkMode ? 'text-white/30' : 'text-slate-400'}`}>No hay historial</span>
                </div>
            ) : (
                calledNumbers.slice(1).map((num, idx) => { // Skip the first one (current)
                    const colIdx = getColIndex(num);
                    const theme = COLUMN_THEME[colIdx];
                    return (
                        <div key={idx} className={`
                            w-10 h-10 rounded-full flex items-center justify-center shadow-md relative
                            border-[2px] ${darkMode ? 'border-white/10' : 'border-white/20'}
                            bg-gradient-to-br ${theme.gradientBg}
                        `}>
                            {/* Shine effect */}
                            <div className="absolute top-1 left-2 w-3 h-1.5 bg-white/40 rounded-full blur-[1px] transform -rotate-45" />

                            <div className="flex flex-col items-center leading-none">
                                <span className="text-[8px] font-bold text-white/90 drop-shadow-sm">
                                    {getColumnForNumber(num)}
                                </span>
                                <span className="text-sm font-black text-white drop-shadow-md">
                                    {num}
                                </span>
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    );
};
