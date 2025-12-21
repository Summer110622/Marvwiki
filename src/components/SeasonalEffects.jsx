import React, { useEffect, useRef } from 'react';
import './SeasonalEffects.css';

const SeasonalEffects = ({ season }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        // No effect for null or special handling for summer
        if (!season || season === 'summer') {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const particles = [];
        const particleCount = season === 'winter' ? 120 : 60;

        class Particle {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.x = Math.random() * width;
                this.y = initial ? Math.random() * height : -20;
                this.size = Math.random() * 5 + 2;
                this.speedY = Math.random() * 1.5 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 2 - 1;
                this.sinOffset = Math.random() * Math.PI * 2;
                this.sinSpeed = Math.random() * 0.02 + 0.01;

                if (season === 'spring') {
                    // Sakura petals
                    this.color = `rgba(255, ${180 + Math.random() * 40}, ${203 + Math.random() * 20}, ${0.6 + Math.random() * 0.4})`;
                    this.size = Math.random() * 4 + 4;
                } else if (season === 'autumn') {
                    // Autumn leaves
                    const colors = ['#e67e22', '#d35400', '#f39c12', '#c0392b', '#8e44ad'];
                    this.color = colors[Math.floor(Math.random() * colors.length)];
                    this.size = Math.random() * 6 + 4;
                } else {
                    // Snow
                    this.color = 'white';
                    this.size = Math.random() * 3 + 2;
                    this.speedY = Math.random() * 1 + 0.5;
                }
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX + Math.sin(this.y * this.sinSpeed + this.sinOffset) * 0.5;
                this.rotation += this.rotationSpeed;

                if (this.y > height + 20) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate((this.rotation * Math.PI) / 180);
                ctx.fillStyle = this.color;

                if (season === 'winter') {
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = 'white';
                    ctx.fill();
                } else {
                    // Petal/Leaf shape: an oval with a slight point
                    ctx.beginPath();
                    ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // Add a middle line for leaves
                    if (season === 'autumn') {
                        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(-this.size, 0);
                        ctx.lineTo(this.size, 0);
                        ctx.stroke();
                    }
                }
                ctx.restore();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            animationRef.current = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [season]);

    if (!season) return null;

    return (
        <>
            {(season === 'spring' || season === 'autumn' || season === 'winter') && (
                <canvas
                    ref={canvasRef}
                    className="seasonal-canvas"
                />
            )}
            {season === 'summer' && (
                <div className="summer-container">
                    <div className="sun"></div>
                    <div className="sun-flare"></div>
                    <div className="heat-haze"></div>
                </div>
            )}
        </>
    );
};

export default SeasonalEffects;
