import { useState, useEffect } from 'react';
import { GameState, GameStatus } from '../types';
import { STORAGE_KEY, TOTAL_NUMBERS } from '../utils/constants';

export const useBingoGame = () => {
    const [gameState, setGameState] = useState<GameState>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.error("Failed to parse saved state", e);
                }
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

    const [isSpinning, setIsSpinning] = useState(false);
    const [displayNumber, setDisplayNumber] = useState<number | null>(null);
    const [pendingNumber, setPendingNumber] = useState<number | null>(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }, [gameState]);

    useEffect(() => {
        if (!isSpinning) {
            setDisplayNumber(gameState.lastNumber);
            setPendingNumber(null);
        }
    }, [gameState.lastNumber, isSpinning]);

    const drawBall = (showToast: (msg: string) => void) => {
        if (gameState.calledNumbers.length >= TOTAL_NUMBERS) {
            showToast("¡Se han sacado todas las balotas!");
            return;
        }

        const hasSelectedPattern = gameState.pattern.some(Boolean);
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

        setPendingNumber(nextNum);

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

    const resetGame = () => {
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
        setPendingNumber(null);
    };

    const togglePatternCell = (index: number, showToast: (msg: string) => void) => {
        const isGameStarted = gameState.calledNumbers.length > 0;
        const isLocked = isGameStarted || isSpinning;

        if (isLocked) {
            showToast("🔒 No puedes cambiar la figura durante el juego");
            return;
        }
        const newPattern = [...gameState.pattern];
        newPattern[index] = !newPattern[index];
        setGameState(prev => ({ ...prev, pattern: newPattern }));
    };

    return {
        gameState,
        isSpinning,
        displayNumber,
        pendingNumber,
        drawBall,
        resetGame,
        togglePatternCell
    };
};
