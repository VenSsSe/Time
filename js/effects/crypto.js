export const cryptoEffect = {
    isRunning: false,
    socket: null,
    animationFrameId: null,
    lastPrice: 0,
    priceDirection: 0, // 1 for up, -1 for down, 0 for neutral

    setup: function(symbol = 'BTCUSDT') {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastPrice = 0;
        this.priceDirection = 0;

        const canvas = document.getElementById('crypto-canvas');
        if (!canvas) return;

        const priceContainer = document.getElementById('btc-price-container');
        priceContainer.innerHTML = `
            <div id="price-wrapper" class="crypto-price-wrapper">
                <span id="crypto-price" class="text-4xl md:text-5xl font-bold">Loading...</span>
                <span id="price-indicator" class="price-indicator"></span>
                <div id="crypto-ticker" class="text-lg text-gray-400 font-semibold">${symbol.replace('USDT', '/USDT')}</div>
            </div>
        `;

        const ctx = canvas.getContext('2d');
        let width, height;
        let candles = [];

        const setCanvasSize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight * 0.5;
            canvas.style.top = 'auto';
            canvas.style.bottom = '0';
        };
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        const socketUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_1s`;
        this.socket = new WebSocket(socketUrl);

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const kline = data.k;
            const newCandle = {
                time: kline.t,
                open: parseFloat(kline.o),
                high: parseFloat(kline.h),
                low: parseFloat(kline.l),
                close: parseFloat(kline.c)
            };

            if (candles.length > 0 && candles[candles.length - 1].time === newCandle.time) {
                candles[candles.length - 1] = newCandle;
            } else {
                candles.push(newCandle);
            }

            const chartWidth = width - 80; // Reserve space for Y-axis
            if (candles.length > Math.floor(chartWidth / 10)) {
                candles.shift();
            }

            const priceWrapper = document.getElementById('price-wrapper');
            const priceEl = document.getElementById('crypto-price');
            const indicatorEl = document.getElementById('price-indicator');

            if (priceEl) {
                const newPrice = parseFloat(kline.c);
                priceEl.textContent = newPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                
                if (this.lastPrice !== 0) {
                    if (newPrice > this.lastPrice) {
                        this.priceDirection = 1; // UP
                        indicatorEl.textContent = '▲';
                        priceWrapper.classList.remove('price-down');
                        priceWrapper.classList.add('price-up');
                    } else if (newPrice < this.lastPrice) {
                        this.priceDirection = -1; // DOWN
                        indicatorEl.textContent = '▼';
                        priceWrapper.classList.remove('price-up');
                        priceWrapper.classList.add('price-down');
                    }
                }
                this.lastPrice = newPrice;
            }
        };

        const draw = () => {
            if (!this.isRunning) return;
            
            // --- НОВЫЙ ДИЗАЙН ГРАФИКА ---
            const yAxisWidth = 80;
            const chartWidth = width - yAxisWidth;

            // 1. Динамический фон
            ctx.clearRect(0, 0, width, height);
            let bgColor = 'rgba(0, 0, 0, 0)';
            if (this.priceDirection > 0) {
                bgColor = 'rgba(16, 185, 129, 0.1)'; // Greenish glow
            } else if (this.priceDirection < 0) {
                bgColor = 'rgba(239, 68, 68, 0.1)'; // Reddish glow
            }
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, chartWidth, height);

            if (candles.length === 0) {
                this.animationFrameId = requestAnimationFrame(draw);
                return;
            }

            const maxPrice = Math.max(...candles.map(c => c.high));
            const minPrice = Math.min(...candles.map(c => c.low));
            const priceRange = maxPrice === minPrice ? 1 : maxPrice - minPrice;
            
            // 2. Сетка и шкала цен (Y-ось)
            const gridLines = 5;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '12px Orbitron';
            ctx.setLineDash([3, 6]);

            for (let i = 0; i <= gridLines; i++) {
                const price = maxPrice - (i * (priceRange / gridLines));
                const y = (i / gridLines) * height * 0.9 + (height * 0.05);
                
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(chartWidth, y);
                ctx.stroke();
                
                ctx.fillText(price.toFixed(2), chartWidth + 10, y + 4);
            }
            ctx.setLineDash([]);

            // 3. Водяной знак
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.font = 'bold 80px Orbitron';
            ctx.textAlign = 'center';
            ctx.fillText(symbol.replace('USDT', ''), chartWidth / 2, height / 2 + 30);
            
            // 4. Свечи
            const candleWidth = 10;
            const spacing = 4;
            const upColor = { wick: '#34d399', glow: 'rgba(16, 185, 129, 0.7)', gradStart: '#34d399', gradEnd: '#059669' };
            const downColor = { wick: '#f87171', glow: 'rgba(239, 68, 68, 0.7)', gradStart: '#f87171', gradEnd: '#dc2626' };

            candles.forEach((candle, i) => {
                const x = chartWidth - (candles.length - i) * (candleWidth + spacing);
                const yHigh = ((maxPrice - candle.high) / priceRange) * height * 0.9 + (height * 0.05);
                const yLow = ((maxPrice - candle.low) / priceRange) * height * 0.9 + (height * 0.05);
                const yOpen = ((maxPrice - candle.open) / priceRange) * height * 0.9 + (height * 0.05);
                const yClose = ((maxPrice - candle.close) / priceRange) * height * 0.9 + (height * 0.05);
                
                const isUp = candle.close >= candle.open;
                const colors = isUp ? upColor : downColor;
                
                const yBody = Math.min(yOpen, yClose);
                const bodyHeight = Math.max(1, Math.abs(yOpen - yClose));

                ctx.shadowColor = colors.glow;
                ctx.shadowBlur = 12;

                ctx.strokeStyle = colors.wick;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x + candleWidth / 2, yHigh);
                ctx.lineTo(x + candleWidth / 2, yLow);
                ctx.stroke();

                const gradient = ctx.createLinearGradient(x, yBody, x, yBody + bodyHeight);
                gradient.addColorStop(0, colors.gradStart);
                gradient.addColorStop(1, colors.gradEnd);
                
                ctx.fillStyle = gradient;
                ctx.fillRect(x, yBody, candleWidth, bodyHeight);
                
                ctx.strokeStyle = colors.wick;
                ctx.lineWidth = 1;
                ctx.strokeRect(x, yBody, candleWidth, bodyHeight);

                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
            });
            this.animationFrameId = requestAnimationFrame(draw);
        };
        draw();
    },

    stop: function() {
        if (!this.isRunning) return;
        this.isRunning = false;
        if (this.socket) this.socket.close();
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

        const canvas = document.getElementById('crypto-canvas');
        if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        
        const priceContainer = document.getElementById('btc-price-container');
        if (priceContainer) priceContainer.innerHTML = '';
    }
};

