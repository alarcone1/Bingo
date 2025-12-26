import { useState, useCallback, useEffect } from 'react';

export const useSoundEffects = () => {
    const [isMuted, setIsMuted] = useState(false);

    // Initialize speech synthesis voices
    useEffect(() => {
        const loadVoices = () => {
            window.speechSynthesis.getVoices();
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const speak = useCallback((text: string) => {
        if (isMuted) return;

        // Cancel any pending speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES'; // Spanish
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1;

        // Try to find a good Spanish voice
        const voices = window.speechSynthesis.getVoices();
        const spanishVoice = voices.find(v => v.lang.includes('es') && !v.name.includes('Google')) || voices.find(v => v.lang.includes('es'));

        if (spanishVoice) {
            utterance.voice = spanishVoice;
        }

        window.speechSynthesis.speak(utterance);
    }, [isMuted]);

    const playSpin = useCallback(() => {
        if (isMuted) return;
        // Placeholder for spin sound - in a real app would play an Audio file
        // const audio = new Audio('/sounds/spin.mp3');
        // audio.play().catch(e => console.log("Audio play failed", e));
        console.log("🔊 Playing Spin Sound");
    }, [isMuted]);

    const playPop = useCallback(() => {
        if (isMuted) return;
        // Placeholder for pop/click sound
        // const audio = new Audio('/sounds/pop.mp3');
        // audio.play();
        console.log("🔊 Playing Pop Sound");
    }, [isMuted]);

    return {
        isMuted,
        setIsMuted,
        speak,
        playSpin,
        playPop
    };
};
