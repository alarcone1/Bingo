import React from 'react';
import { BingoCard } from '../../utils/generator';

interface Props {
    card: BingoCard;
    darkMode: boolean;
}

export const BingoCardPreview: React.FC<Props> = ({ card, darkMode }) => {
    const getCellClass = (isHeader: boolean = false, isCenter: boolean = false) => `
    flex items-center justify-center text-[10px] font-bold border
    ${isHeader
            ? (darkMode ? 'bg-rose-600 border-rose-500 text-white' : 'bg-rose-500 border-rose-400 text-white')
            : (isCenter
                ? (darkMode ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-amber-100 border-amber-200 text-amber-700')
                : (darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700')
            )
        }
  `;

    return (
        <div className={`p-2 rounded-lg border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center mb-1 px-1">
                <span className={`text-[10px] font-black uppercase ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    ID: {card.id}
                </span>
            </div>

            <div className="grid grid-cols-5 gap-0.5 text-center w-full aspect-[4/5]">
                {/* Headers */}
                {['B', 'I', 'N', 'G', 'O'].map((letter) => (
                    <div key={letter} className={`h-6 rounded-t-sm ${getCellClass(true)}`}>
                        {letter}
                    </div>
                ))}

                {/* Rows */}
                {[0, 1, 2, 3, 4].map((rowIndex) => (
                    <React.Fragment key={rowIndex}>
                        {/* B */}
                        <div className={`h-6 ${getCellClass()}`}>{card.b[rowIndex]}</div>
                        {/* I */}
                        <div className={`h-6 ${getCellClass()}`}>{card.i[rowIndex]}</div>
                        {/* N */}
                        <div className={`h-6 ${getCellClass(false, rowIndex === 2)}`}>
                            {rowIndex === 2 ? card.id : card.n[rowIndex < 2 ? rowIndex : rowIndex - 1]}
                        </div>
                        {/* G */}
                        <div className={`h-6 ${getCellClass()}`}>{card.g[rowIndex]}</div>
                        {/* O */}
                        <div className={`h-6 ${getCellClass()}`}>{card.o[rowIndex]}</div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
