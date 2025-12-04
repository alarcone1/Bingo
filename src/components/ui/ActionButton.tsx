import React from 'react';

interface ActionButtonProps {
    onClick: () => void;
    label: string;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick, label, icon, variant = 'primary', disabled = false }) => {
    const baseStyle = "flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none w-full";

    const variants = {
        primary: "bg-gradient-to-r from-rose-400 to-fuchsia-500 text-white hover:from-rose-500 hover:to-fuchsia-600 shadow-rose-300/50",
        secondary: "bg-white/60 text-rose-700 hover:bg-white/80 border border-white", // Used rarely
        danger: "bg-gradient-to-r from-red-400 to-red-600 text-white hover:from-red-500 hover:to-red-700 shadow-red-300/50"
    };

    return (
        <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]}`}>
            {icon}
            <span>{label}</span>
        </button>
    );
};
