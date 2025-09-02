// js/modules/crypto-manager.js
import { cryptoPairs } from '../../config/crypto-config.js';

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
        
        priceIndicatorEl.classList.remove('indicator-flash');
        void priceIndicatorEl.offsetWidth; // Trick to restart animation
        priceIndicatorEl.classList.add('indicator-flash');
    }

    lastPrice = currentPrice;
}

function switchNextCrypto() {
    lastPrice = 0;
    currentCryptoIndex = (currentCryptoIndex + 1) % cryptoPairs.length;
    return cryptoPairs[currentCryptoIndex];
}

function getCurrentSymbol() {
    return cryptoPairs[currentCryptoIndex].symbol;
}

export const cryptoManager = {
    updatePrice,
    switchNextCrypto,
    getCurrentSymbol
};