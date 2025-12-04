import React from 'react';
import { getColumnForNumber } from '../../utils/constants';

interface BingoBallProps {
    hasSelectedPattern: boolean;
    calledNumbersCount: number;
    isSpinning: boolean;
    displayNumber: number | null;
    lastNumber: number | null;
}

export const BingoBall: React.FC<BingoBallProps> = ({
    hasSelectedPattern,
    calledNumbersCount,
    isSpinning,
    displayNumber,
    lastNumber
}) => {
    if (!hasSelectedPattern) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full animate-pulse text-center">
                <span className="text-4xl font-black text-white drop-shadow-lg block">¿FIGURA?</span>
                <span className="text-xs text-white/90 font-bold mt-1 block tracking-wide drop-shadow-sm uppercase">Definir Primero</span>
            </div>
        );
    }

    if (calledNumbersCount === 0 && !isSpinning) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full text-center">
                <span className="text-2xl font-black text-white leading-tight drop-shadow-lg block">Primera<br />Balota</span>
                <span className="text-xs text-white/90 mt-1 block font-medium drop-shadow-sm">Lista para jugar</span>
            </div>
        );
    }

    const numToShow = isSpinning ? displayNumber : lastNumber;

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
