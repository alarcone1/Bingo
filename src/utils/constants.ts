export const STORAGE_KEY = 'bingo-rose-gold-state';
export const DARK_MODE_KEY = 'bingo-ely-dark-mode';
export const TOTAL_NUMBERS = 75;
export const COLUMNS = ['B', 'I', 'N', 'G', 'O'];

// Helper to get column index (0-4) from number
export const getColIndex = (num: number) => Math.ceil(num / 15) - 1;

// Range helper: B (1-15), I (16-30), etc.
export const getColumnForNumber = (num: number) => COLUMNS[getColIndex(num)];

// --- COLOR THEMES FOR COLUMNS (Jewel Tones Revised) ---
// Added textDark for better contrast in Dark Mode
export const COLUMN_THEME = [
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
