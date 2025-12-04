import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    icon?: React.ReactNode;
    id?: string;
    headerAction?: React.ReactNode;
    darkMode?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', title, icon, id, headerAction, darkMode = false }) => (
    <div id={id} className={`
    ${darkMode ? 'bg-black/40 border-white/10 shadow-black/50 hover:bg-black/50' : 'bg-white/40 border-white/60 shadow-xl hover:bg-white/50'}
    backdrop-blur-xl border 
    rounded-3xl p-6 relative 
    transition-all duration-300 hover:shadow-2xl 
    ${className.includes('overflow-visible') ? '' : 'overflow-hidden'}
    ${className}
  `}>
        {/* Shine */}
        <div className={`absolute top-0 left-0 w-full h-full pointer-events-none rounded-3xl ${darkMode ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-white/40 to-transparent'}`} />

        {(title || icon) && (
            <div className={`flex items-center justify-between mb-4 z-10 relative pb-2 border-b header-container ${darkMode ? 'border-white/10' : 'border-rose-100/50'}`}>
                <div className="flex items-center gap-3">
                    {icon && <div className="text-rose-500 drop-shadow-sm icon-elem">{icon}</div>}
                    {title && (
                        <h2 className="font-black text-lg uppercase tracking-widest bg-gradient-to-r from-rose-600 via-rose-500 to-fuchsia-600 bg-clip-text text-transparent drop-shadow-sm title-text">
                            {title}
                        </h2>
                    )}
                </div>
                {headerAction && <div className="header-action">{headerAction}</div>}
            </div>
        )}
        <div className="relative z-10 h-full">{children}</div>
    </div>
);
