import React, { useEffect, useRef } from 'react';

interface AnimationProps {
    particleCount: number;
    speedMultiplier: number;
    darkMode: boolean;
}

// Particle Class Definition
class Particle {
    x: number;
    y: number;
    dirX: number;
    dirY: number;
    radius: number;
    baseRadius: number;
    color: { r: number, g: number, b: number };
    phase: number;
    pulseSpeed: number;

    constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.dirX = (Math.random() - 0.5);
        this.dirY = (Math.random() - 0.5);
        this.baseRadius = Math.random() * 20 + 15;
        this.radius = this.baseRadius;

        const COLORS = [
            { r: 236, g: 72, b: 153 },  // Pink (B)
            { r: 251, g: 191, b: 36 },  // Amber/Gold (I)
            { r: 139, g: 92, b: 246 },  // Violet (N)
            { r: 249, g: 115, b: 22 },  // Orange (G)
            { r: 14, g: 165, b: 233 }   // Sky Blue (O)
        ];
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];

        this.phase = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.02;
    }

    update(w: number, h: number, speedMult: number) {
        this.x += this.dirX * speedMult;
        this.y += this.dirY * speedMult;

        if (this.x < -this.radius || this.x > w + this.radius) this.dirX *= -1;
        if (this.y < -this.radius || this.y > h + this.radius) this.dirY *= -1;

        // Bounds safety
        if (this.x < -100) this.x = w + 90;
        if (this.x > w + 100) this.x = -90;
        if (this.y < -100) this.y = h + 90;
        if (this.y > h + 100) this.y = -90;

        this.phase += this.pulseSpeed;
        this.radius = this.baseRadius + Math.sin(this.phase) * 5;
    }

    draw(ctx: CanvasRenderingContext2D, darkMode: boolean) {
        const { r, g, b } = this.color;

        // Adjust opacity for dark mode (make them glow more)
        const opacityCenter = darkMode ? 0.8 : 0.9;
        const opacityEdge = darkMode ? 0.1 : 0.2;

        const gradient = ctx.createRadialGradient(
            this.x - this.radius * 0.3,
            this.y - this.radius * 0.3,
            this.radius * 0.1,
            this.x,
            this.y,
            this.radius
        );
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacityCenter})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${opacityEdge})`);

        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0, this.radius), 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}

export const BackgroundAnimation: React.FC<AnimationProps> = ({ particleCount, speedMultiplier, darkMode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationIdRef = useRef<number>(0);
    const speedRef = useRef(speedMultiplier);
    const darkModeRef = useRef(darkMode);

    useEffect(() => {
        speedRef.current = speedMultiplier;
    }, [speedMultiplier]);

    useEffect(() => {
        darkModeRef.current = darkMode;
    }, [darkMode]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        const currentLength = particlesRef.current.length;
        const targetLength = particleCount;

        if (targetLength > currentLength) {
            for (let i = 0; i < targetLength - currentLength; i++) {
                particlesRef.current.push(new Particle(canvas.width, canvas.height));
            }
        } else if (targetLength < currentLength) {
            particlesRef.current.splice(targetLength);
        }
    }, [particleCount]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const CONNECTION_DISTANCE = 280;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        if (particlesRef.current.length === 0) {
            for (let i = 0; i < particleCount; i++) {
                particlesRef.current.push(new Particle(canvas.width, canvas.height));
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const isDark = darkModeRef.current;

            particlesRef.current.forEach(p => {
                p.update(canvas.width, canvas.height, speedRef.current);
                p.draw(ctx, isDark);
            });

            for (let i = 0; i < particlesRef.current.length; i++) {
                for (let j = i + 1; j < particlesRef.current.length; j++) {
                    const p1 = particlesRef.current[i];
                    const p2 = particlesRef.current[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < CONNECTION_DISTANCE) {
                        const opacity = 1 - (dist / CONNECTION_DISTANCE);

                        const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                        // Lighter lines in dark mode
                        const alphaMult = isDark ? 0.4 : 0.6;

                        gradient.addColorStop(0, `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, ${opacity * alphaMult})`);
                        gradient.addColorStop(1, `rgba(${p2.color.r}, ${p2.color.g}, ${p2.color.b}, ${opacity * alphaMult})`);

                        ctx.beginPath();
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = 3 * opacity;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            animationIdRef.current = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationIdRef.current);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};
