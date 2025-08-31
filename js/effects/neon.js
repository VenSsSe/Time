// Экспортируем объект, чтобы его можно было импортировать в других файлах
export const neonEffect = {
    isRunning: false,
    animationId: null,
    setup: function() {
        if (this.isRunning) return;
        this.isRunning = true;

        const canvas = document.getElementById('neon-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        let width, height;
        const setCanvasSize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        setCanvasSize();

        const gridColor = '#ff00de';
        const horizon = height * 0.6;
        const perspective = width * 0.8;
        const speed = 2;
        let zOffset = 0;

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.save();
            ctx.translate(width / 2, horizon);

            const lineCount = 50;
            const spacing = height / lineCount;

            // Горизонтальные линии
            for (let i = 1; i < lineCount; i++) {
                const z = (i * spacing + zOffset) % (lineCount * spacing);
                const y = z / 10;
                const scale = perspective / (perspective + z);
                const lineWidth = width * scale;
                
                if (y > 0) {
                    ctx.beginPath();
                    ctx.moveTo(-lineWidth / 2, y);
                    ctx.lineTo(lineWidth / 2, y);
                    ctx.strokeStyle = gridColor;
                    ctx.lineWidth = 1 * scale;
                    ctx.globalAlpha = (1 - (z / (lineCount * spacing))) * 0.8;
                    ctx.stroke();
                }
            }

            // Вертикальные линии
            const verticalSpacing = width / 20;
            for (let i = -10; i <= 10; i++) {
                ctx.beginPath();
                ctx.moveTo(i * verticalSpacing, 0);
                ctx.lineTo(i * verticalSpacing * 100, height);
                ctx.strokeStyle = gridColor;
                ctx.lineWidth = 1;
                ctx.globalAlpha = 0.5;
                ctx.stroke();
            }

            ctx.restore();
            zOffset = (zOffset + speed) % (lineCount * spacing);
            this.animationId = requestAnimationFrame(draw);
        };
        draw();

        window.addEventListener('resize', setCanvasSize);
    },
    stop: function() {
        if (!this.isRunning) return;
        this.isRunning = false;
        cancelAnimationFrame(this.animationId);
        const canvas = document.getElementById('neon-canvas');
        if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    }
};

