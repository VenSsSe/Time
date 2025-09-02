import { cryptoManager } from '../modules/crypto-manager.js';

// This is the final, stable version of the crypto effect.
// It is responsible for rendering the chart and the price ticker UI.
// It is controlled by event-handlers.js

export const cryptoEffect = {
    chart: null,
    socket: null,
    intervalId: null,
    listeners: [],
    currentSymbol: 'BTCUSDT', // Keep track of the symbol internally

    setup: function(initialSymbol = 'BTCUSDT') {
        this.currentSymbol = initialSymbol;
        const canvas = document.getElementById('crypto-canvas');
        if (!canvas) return;

        this.updateTickerUI(this.currentSymbol);

        const resizeHandler = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeHandler();
        window.addEventListener('resize', resizeHandler);
        this.listeners.push({ target: window, type: 'resize', handler: resizeHandler });

        this.switchTimeframe('minute');
    },

    stop: function() {
        return new Promise((resolve) => {
            this.cleanup();
            this.listeners.forEach(({ target, type, handler }) => target.removeEventListener(type, handler));
            this.listeners = [];
            const canvas = document.getElementById('crypto-canvas');
            if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            const priceContainer = document.getElementById('btc-price-container');
            if (priceContainer) priceContainer.innerHTML = '<!-- Содержимое будет добавлено JS -->';
            document.querySelectorAll('.timer-block.active').forEach(b => b.classList.remove('active'));
            resolve();
        });
    },

    cleanup: function() {
        if (this.chart) { this.chart.destroy(); this.chart = null; }
        if (this.socket) { this.socket.close(); this.socket = null; }
        if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }
    },

    updateTickerUI: function(symbol) {
        const priceContainer = document.getElementById('btc-price-container');
        if (!priceContainer) return;
        priceContainer.innerHTML = `
            <div id="price-wrapper" class="crypto-price-wrapper">
                <span id="crypto-price" class="font-bold">Loading...</span>
                <span id="price-indicator" class="price-indicator"></span>
                <div id="crypto-ticker" class="text-lg text-gray-400 font-semibold">${symbol.replace('USDT', '/USDT')}</div>
            </div>
        `;
    },

    updateSymbol: function(pair) {
        this.currentSymbol = pair.symbol;
        this.updateTickerUI(this.currentSymbol);
        const activeTf = document.querySelector('.timer-block.active')?.id.split('-')[0] || 'minute';
        this.switchTimeframe(activeTf);
    },

    switchTimeframe: async function(timeframe) {
        this.cleanup();
        const canvas = document.getElementById('crypto-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const binanceIntervals = { second: '1s', minute: '1m', hour: '1h', day: '1d' };

        const fetchBinanceData = async (tf) => {
            const interval = binanceIntervals[tf];
            const url = `https://api.binance.com/api/v3/klines?symbol=${this.currentSymbol}&interval=${interval}&limit=100`;
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`API error`);
                return (await response.json()).map(d => ({ x: d[0], o: parseFloat(d[1]), h: parseFloat(d[2]), l: parseFloat(d[3]), c: parseFloat(d[4]) }));
            } catch (error) { console.error(error); return []; }
        };

        const createChart = (data, unit) => {
            const options = { responsive: true, maintainAspectRatio: false, scales: { x: { type: 'time', time: { unit }, grid: { color: 'rgba(48, 54, 61, 0.5)' }, ticks: { color: '#8b949e' } }, y: { grid: { color: 'rgba(48, 54, 61, 0.5)' }, ticks: { color: '#8b949e' } } }, plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } } };
            return new Chart(ctx, { type: 'candlestick', data: { datasets: [{ label: this.currentSymbol, data }] }, options });
        };

        const updateHeader = (candle, prevCandle) => {
            cryptoManager.updatePrice(candle.c);
        };

        if (timeframe === 'second') {
            this.socket = new WebSocket(`wss://stream.binance.com:9443/ws/${this.currentSymbol.toLowerCase()}@kline_1s`);
            this.chart = createChart([], 'second');
            this.socket.onmessage = (event) => {
                const kline = JSON.parse(event.data).k;
                const candle = { x: kline.t, o: parseFloat(kline.o), h: parseFloat(kline.h), l: parseFloat(kline.l), c: parseFloat(kline.c) };
                const dataset = this.chart.data.datasets[0];
                const lastCandle = dataset.data.length > 0 ? dataset.data[dataset.data.length - 1] : null;
                if (lastCandle && lastCandle.x === candle.x) { dataset.data[dataset.data.length - 1] = candle; } 
                else { dataset.data.push(candle); if (dataset.data.length > 120) dataset.data.shift(); }
                this.chart.update('quiet');
                updateHeader(candle, lastCandle);
            };
        } else {
            const data = await fetchBinanceData(timeframe);
            if (data.length > 1) updateHeader(data[data.length - 1], data[data.length - 2]);
            this.chart = createChart(data, timeframe);
            this.intervalId = setInterval(async () => {
                const newData = await fetchBinanceData(timeframe);
                if (newData.length > 0) {
                    this.chart.data.datasets[0].data = newData;
                    this.chart.update('quiet');
                    if (newData.length > 1) updateHeader(newData[newData.length - 1], newData[newData.length - 2]);
                }
            }, 60000);
        }
    }
};