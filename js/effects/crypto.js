// js/effects/crypto.js
import { cryptoManager } from '../modules/crypto-manager.js';
import { apiSettings } from '../../config/crypto-config.js';

export const cryptoEffect = {
    isRunning: false,
    socket: null,
    priceUpdateIntervalId: null,
    animationFrameId: null,
    resizeHandler: null,

    async fetchPrice(symbol) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            
            if (this.isRunning) {
                cryptoManager.updatePrice(data.price);
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error("Failed to fetch crypto price:", error);
            }
        }
    },

    setup: function(symbol = 'BTCUSDT') {
        if (this.isRunning) return;
        this.isRunning = true;

        this.fetchPrice(symbol);
        this.priceUpdateIntervalId = setInterval(() => {
            if (this.isRunning) this.fetchPrice(symbol);
        }, apiSettings.priceUpdateInterval);

        const canvas = document.getElementById('crypto-canvas');
        if (!canvas) return;

        const priceContainer = document.getElementById('btc-price-container');
        priceContainer.innerHTML = `
            <div id="price-wrapper" class="crypto-price-wrapper">
                <span id="crypto-price" class="font-bold">Loading...</span>
                <span id="price-indicator" class="price-indicator"></span>
                <div id="crypto-ticker" class="text-lg text-gray-400 font-semibold">${symbol.replace('USDT', '/USDT')}</div>
            </div>
        `;

        const ctx = canvas.getContext('2d');
        let candles = [];

        const setCanvasSize = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight * 0.5;
        };
        
        this.resizeHandler = setCanvasSize.bind(this);
        window.addEventListener('resize', this.resizeHandler);
        setCanvasSize();

        const streamName = `${symbol.toLowerCase()}@kline_1m`;
        this.socket = new WebSocket(`wss://stream.binance.com:9443/ws/${streamName}`);

        this.socket.onmessage = (event) => {
            if (!this.isRunning) return;
            const data = JSON.parse(event.data);
            const kline = data.k;
            
            const newCandle = {
                time: kline.t, open: parseFloat(kline.o), high: parseFloat(kline.h),
                low: parseFloat(kline.l), close: parseFloat(kline.c),
                isUp: parseFloat(kline.c) >= parseFloat(kline.o),
            };

            if (candles.length > 0 && candles[candles.length - 1].time === newCandle.time) {
                candles[candles.length - 1] = newCandle;
            } else {
                candles.push(newCandle);
            }
            if (candles.length > 100) candles.shift();
        };
        
        const draw = () => {
             if (!this.isRunning) return;
            // ... (rest of the draw function is the same)
        };
        this.animationFrameId = requestAnimationFrame(draw);
    },

    // ИСПРАВЛЕНО: Функция stop теперь асинхронная и возвращает Promise
    stop: function() {
        return new Promise((resolve) => {
            if (!this.isRunning) {
                resolve();
                return;
            }
            this.isRunning = false;

            clearInterval(this.priceUpdateIntervalId);
            if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

            if (this.socket) {
                this.socket.onmessage = null;
                this.socket.onerror = null;
                this.socket.onclose = null;
                if (this.socket.readyState === WebSocket.OPEN) {
                    this.socket.close();
                }
            }
            
            if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
            
            const canvas = document.getElementById('crypto-canvas');
            if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            
            const priceContainer = document.getElementById('btc-price-container');
            if (priceContainer) priceContainer.innerHTML = '';

            this.priceUpdateIntervalId = null;
            this.animationFrameId = null;
            this.socket = null;
            this.resizeHandler = null;
            
            // Гарантируем, что браузер обработал все изменения перед завершением
            setTimeout(() => {
                resolve();
            }, 0);
        });
    }
};
