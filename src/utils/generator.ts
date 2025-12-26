
export interface BingoCard {
    id: number;
    b: number[];
    i: number[];
    n: number[];
    g: number[];
    o: number[];
}

/**
 * Generates a unique array of random numbers within a range.
 * @param count Number of items to generate
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 */
const getUniqueRandoms = (count: number, min: number, max: number): number[] => {
    const nums = new Set<number>();
    while (nums.size < count) {
        nums.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(nums);
};

/**
 * Generates a single Bingo Card.
 * @param id The unique ID for this card (displayed in the center).
 */
export const generateBingoCard = (id: number): BingoCard => {
    // Standard Bingo ranges:
    // B: 1-15 (5 numbers)
    // I: 16-30 (5 numbers)
    // N: 31-45 (4 numbers) - Center is ID
    // G: 46-60 (5 numbers)
    // O: 61-75 (5 numbers)

    const b = getUniqueRandoms(5, 1, 15);
    const i = getUniqueRandoms(5, 16, 30);
    const n = getUniqueRandoms(4, 31, 45); // Only 4 for N column (center is free/ID)
    const g = getUniqueRandoms(5, 46, 60);
    const o = getUniqueRandoms(5, 61, 75);

    return {
        id,
        b,
        i,
        n,
        g,
        o,
    };
};

/**
 * Generates a batch of Bingo Cards.
 * @param count Number of cards to generate
 * @param startId Starting ID
 */
export const generateBatch = (count: number, startId: number): BingoCard[] => {
    const cards: BingoCard[] = [];
    for (let i = 0; i < count; i++) {
        cards.push(generateBingoCard(startId + i));
    }
    return cards;
};
