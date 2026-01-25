import { useEffect } from 'react';

const CursorTrail = () => {
    useEffect(() => {
        // Cyber-Physical Cursor Trail Effect
        const canvas = document.createElement('canvas');
        canvas.id = 'cursor-canvas';
        Object.assign(canvas.style, {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 9999,
            mixBlendMode: 'screen'
        });
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let particles = [];
        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', resize);
        resize();

        // Mouse tracking
        const mouse = { x: width / 2, y: height / 2 };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            createParticle(mouse.x, mouse.y);
        });

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.size = Math.random() * 2 + 1;
                this.life = 1;
                this.color = Math.random() > 0.5 ? '#6366f1' : '#06b6d4'; // Indigo or Cyan
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life -= 0.02;
                this.size *= 0.95;
            }

            draw(ctx) {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.life;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function createParticle(x, y) {
            // Limit opacity/density
            if (particles.length > 50) particles.shift();
            particles.push(new Particle(x, y));
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach((p, i) => {
                p.update();
                p.draw(ctx);
                if (p.life <= 0) particles.splice(i, 1);
            });
            requestAnimationFrame(animate);
        }

        const animId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
            if (document.body.contains(canvas)) document.body.removeChild(canvas);
        };
    }, []);

    return null;
};

export default CursorTrail;
