// js/modules/crypto-manager.js
import { cryptoPairs } from '../../config/crypto-config.js';
import { themeManager } from './theme-manager.js';

let currentCryptoIndex = 0;
let lastPrice = 0;

function updatePrice(newPrice) {
    const priceWrapper = document.getElementById('price-wrapper');
    const cryptoPriceEl = document.getElementById('crypto-price');
    const priceIndicatorEl = document.getElementById('price-indicator');

    if (!priceWrapper || !cryptoPriceEl || !priceIndicatorEl) return;

    const currentPrice = parseFloat(newPrice);
    
    const formattedPrice = currentPrice.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
    });
    cryptoPriceEl.textContent = formattedPrice;

    if (lastPrice !== 0) {
        priceWrapper.classList.remove('price-up', 'price-down');

        if (currentPrice > lastPrice) {
            priceWrapper.classList.add('price-up');
            priceIndicatorEl.textContent = '▲';
        } else if (currentPrice < lastPrice) {
            priceWrapper.classList.add('price-down');
            priceIndicatorEl.textContent = '▼';
        }
        
        // ИСПРАВЛЕНО: Применяем анимацию только к индикатору
        priceIndicatorEl.classList.remove('indicator-flash');
        void priceIndicatorEl.offsetWidth; // Трюк для перезапуска анимации
        priceIndicatorEl.classList.add('indicator-flash');
    }

    lastPrice = currentPrice;
}

function updateTicker(symbol) {
    const tickerEl = document.getElementById('crypto-ticker');
    if (tickerEl) {
        tickerEl.textContent = symbol.replace('USDT', '/USDT');
    }
}

function switchNextCrypto() {
    lastPrice = 0;
    currentCryptoIndex = (currentCryptoIndex + 1) % cryptoPairs.length;
    const nextPair = cryptoPairs[currentCryptoIndex];
    
    updateTicker(nextPair.symbol);
    
    if (themeManager.isCurrentTheme('crypto')) {
        themeManager.stopCurrentAnimation();
        themeManager.startCryptoAnimation(nextPair.symbol);
    }
}

function selectCrypto(index, pair) {
    lastPrice = 0;
    currentCryptoIndex = index;
    updateTicker(pair.symbol);

    if (themeManager.isCurrentTheme('crypto')) {
        themeManager.stopCurrentAnimation();
        themeManager.startCryptoAnimation(pair.symbol);
    }
}

function getCurrentSymbol() {
    return cryptoPairs[currentCryptoIndex].symbol;
}

export const cryptoManager = {
    updatePrice,
    switchNextCrypto,
    selectCrypto,
    getCurrentSymbol
};