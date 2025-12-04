export type GameStatus = 'SETUP' | 'PLAYING';

export interface GameState {
    status: GameStatus;
    calledNumbers: number[];
    pattern: boolean[]; // Array of 25 booleans (5x5)
    lastNumber: number | null;
    timestamp: number;
}
