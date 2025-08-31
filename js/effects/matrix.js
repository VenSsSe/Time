// Экспортируем объект, чтобы его можно было импортировать в других файлах
export const matrixEffect = {
    isRunning: false,
    animationId: null,
    setup: function() {
        if (this.isRunning) return;
        this.isRunning = true;

        const canvas = document.getElementById('matrix-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const setCanvasSize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        setCanvasSize();
        
        // Очищенная и уникализированная строка символов
        const characters = 'ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんゔゕゖゝゞァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶヷヸヹヺ･ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
        const fontSize = 16;
        let columns = Math.floor(canvas.width / fontSize);
        const rainDrops = Array.from({ length: columns }).map(() => 1);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0F0';
            ctx.font = `${fontSize}px monospace`;
            rainDrops.forEach((drop, i) => {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drop * fontSize);
                if (drop * fontSize > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            });
        };
        this.animationId = setInterval(draw, 33);
        window.addEventListener('resize', () => {
            setCanvasSize();
            columns = Math.floor(canvas.width / fontSize);
        });
    },
    stop: function() {
        if (!this.isRunning) return;
        this.isRunning = false;
        clearInterval(this.animationId);
        const canvas = document.getElementById('matrix-canvas');
        if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    }
};

