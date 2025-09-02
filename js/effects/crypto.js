import { cryptoManager } from '../modules/crypto-manager.js';

// Final implementation, combining the working logic from Проект.html
// with the application's structure.

export const cryptoEffect = {
    chart: null,
    socket: null,
    intervalId: null,
    listeners: [],

    setup: function(initialSymbol = 'BTCUSDT') {
        const canvas = document.getElementById('crypto-canvas');
        const priceContainer = document.getElementById('btc-price-container');
        if (!canvas || !priceContainer) return;

        // --- STATE ---
        let currentSymbol = initialSymbol;
        const ctx = canvas.getContext('2d');

        // --- UI INJECTION ---
        priceContainer.innerHTML = `
            <div id="price-wrapper" class="crypto-price-wrapper">
                <span id="crypto-price" class="font-bold">Loading...</span>
                <span id="price-indicator" class="price-indicator"></span>
                <div id="crypto-ticker" class="text-lg text-gray-400 font-semibold">${currentSymbol.replace('USDT', '/USDT')}</div>
            </div>
        `;

        // --- CANVAS SIZING ---
        const resizeHandler = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeHandler(); // Initial size
        window.addEventListener('resize', resizeHandler);
        this.listeners.push({ target: window, type: 'resize', handler: resizeHandler });

        // --- LOGIC (from Проект.html) ---
        const binanceIntervals = { second: '1s', minute: '1m', hour: '1h', day: '1d' };

        const updatePriceUI = (price, change) => {
            const priceEl = document.getElementById('crypto-price');
            const priceWrapper = document.getElementById('price-wrapper');
            const priceIndicatorEl = document.getElementById('price-indicator');
            if (!priceEl || !priceWrapper || !priceIndicatorEl) return;

            priceEl.textContent = price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            priceWrapper.classList.remove('price-up', 'price-down');
            if (change >= 0) {
                priceWrapper.classList.add('price-up');
                priceIndicatorEl.textContent = '▲';
            } else {
                priceWrapper.classList.add('price-down');
                priceIndicatorEl.textContent = '▼';
            }
            priceIndicatorEl.classList.remove('indicator-flash');
            void priceIndicatorEl.offsetWidth;
            priceIndicatorEl.classList.add('indicator-flash');
        };

        const updateHeaderWithCandle = (candle, prevCandle) => {
            const closePrice = candle.c;
            const prevClosePrice = prevCandle ? prevCandle.c : candle.o;
            const change = ((closePrice - prevClosePrice) / prevClosePrice) * 100;
            updatePriceUI(closePrice, change);
        };

        const fetchBinanceData = async (timeframe) => {
            const interval = binanceIntervals[timeframe];
            const url = `https://api.binance.com/api/v3/klines?symbol=${currentSymbol}&interval=${interval}&limit=100`;
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`API error`);
                const data = await response.json();
                return data.map(d => ({ x: d[0], o: parseFloat(d[1]), h: parseFloat(d[2]), l: parseFloat(d[3]), c: parseFloat(d[4]) }));
            } catch (error) { console.error(error); return []; }
        };

        const createChart = (initialData, timeUnit) => {
            const options = {
                responsive: true, maintainAspectRatio: false,
                scales: { x: { type: 'time', time: { unit: timeUnit }, grid: { color: 'rgba(48, 54, 61, 0.5)' }, ticks: { color: '#8b949e' } }, y: { grid: { color: 'rgba(48, 54, 61, 0.5)' }, ticks: { color: '#8b949e' } } },
                plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } }
            };
            return new Chart(ctx, { type: 'candlestick', data: { datasets: [{ label: currentSymbol, data: initialData }] }, options });
        };

        const cleanup = () => {
            if (this.chart) { this.chart.destroy(); this.chart = null; }
            if (this.socket) { this.socket.close(); this.socket = null; }
            if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }
        };

        const switchTimeframe = async (timeframe) => {
            cleanup();
            if (timeframe === 'second') {
                this.socket = new WebSocket(`wss://stream.binance.com:9443/ws/${currentSymbol.toLowerCase()}@kline_1s`);
                this.chart = createChart([], 'second');
                this.socket.onmessage = (event) => {
                    const kline = JSON.parse(event.data).k;
                    const candle = { x: kline.t, o: parseFloat(kline.o), h: parseFloat(kline.h), l: parseFloat(kline.l), c: parseFloat(kline.c) };
                    const dataset = this.chart.data.datasets[0];
                    const lastCandle = dataset.data.length > 0 ? dataset.data[dataset.data.length - 1] : null;
                    if (lastCandle && lastCandle.x === candle.x) { dataset.data[dataset.data.length - 1] = candle; } 
                    else { dataset.data.push(candle); if (dataset.data.length > 120) dataset.data.shift(); }
                    this.chart.update('quiet');
                    updateHeaderWithCandle(candle, lastCandle);
                };
            } else {
                const data = await fetchBinanceData(timeframe);
                if (data.length > 1) updateHeaderWithCandle(data[data.length - 1], data[data.length - 2]);
                this.chart = createChart(data, timeframe);
                this.intervalId = setInterval(async () => {
                    const newData = await fetchBinanceData(timeframe);
                    if (newData.length > 0) {
                        this.chart.data.datasets[0].data = newData;
                        this.chart.update('quiet');
                        if (newData.length > 1) updateHeaderWithCandle(newData[newData.length - 1], newData[newData.length - 2]);
                    }
                }, 60000);
            }
        };

        // --- EVENT LISTENERS ---
        const selectors = { day: 'day-selector', hour: 'hour-selector', minute: 'minute-selector', second: 'second-selector' };
        Object.entries(selectors).forEach(([tf, id]) => {
            const el = document.getElementById(id);
            const handler = () => {
                if (!document.body.classList.contains('theme-crypto')) return;
                document.querySelectorAll('.timer-block.active').forEach(b => b.classList.remove('active'));
                el.classList.add('active');
                switchTimeframe(tf);
            };
            el.addEventListener('click', handler);
            this.listeners.push({ target: el, type: 'click', handler });
        });

        const priceClickHandler = () => {
            if (!document.body.classList.contains('theme-crypto')) return;
            const nextPair = cryptoManager.switchNextCrypto();
            currentSymbol = nextPair.symbol;
            document.getElementById('crypto-ticker').textContent = nextPair.symbol.replace('USDT', '/USDT');
            const activeTf = document.querySelector('.timer-block.active')?.id.split('-')[0] || 'minute';
            switchTimeframe(activeTf);
        };
        priceContainer.addEventListener('click', priceClickHandler);
        this.listeners.push({ target: priceContainer, type: 'click', handler: priceClickHandler });

        // --- INITIAL LOAD ---
        document.getElementById('minute-selector').classList.add('active');
        switchTimeframe('minute');
    },

    stop: function() {
        return new Promise((resolve) => {
            if (this.chart) { this.chart.destroy(); this.chart = null; }
            if (this.socket) { this.socket.close(); this.socket = null; }
            if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }
            this.listeners.forEach(({ target, type, handler }) => target.removeEventListener(type, handler));
            this.listeners = [];
            const canvas = document.getElementById('crypto-canvas');
            if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            const priceContainer = document.getElementById('btc-price-container');
            if (priceContainer) priceContainer.innerHTML = '<!-- Содержимое будет добавлено JS -->';
            document.querySelectorAll('.timer-block.active').forEach(b => b.classList.remove('active'));
            resolve();
        });
    }
};