// js/modules/crypto-manager.js
// This module ONLY manages the state of the current cryptocurrency.
import { cryptoPairs } from '../../config/crypto-config.js';

let currentCryptoIndex = 0;

function updatePrice(newPrice) {
    const priceWrapper = document.getElementById('price-wrapper');
    const cryptoPriceEl = document.getElementById('crypto-price');
    const priceIndicatorEl = document.getElementById('price-indicator');
    if (!priceWrapper || !cryptoPriceEl || !priceIndicatorEl) return;

    const currentPrice = parseFloat(newPrice);
    const lastPrice = parseFloat(cryptoPriceEl.textContent.replace(/,/g, '')) || 0;

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
        void priceIndicatorEl.offsetWidth;
        priceIndicatorEl.classList.add('indicator-flash');
    }
}

function switchNextCrypto() {
    currentCryptoIndex = (currentCryptoIndex + 1) % cryptoPairs.length;
    return cryptoPairs[currentCryptoIndex];
}

function selectCrypto(index) {
    if (index >= 0 && index < cryptoPairs.length) {
        currentCryptoIndex = index;
        return cryptoPairs[currentCryptoIndex];
    }
    return cryptoPairs[currentCryptoIndex]; // Return current if index is invalid
}

function getCurrentPair() {
    return cryptoPairs[currentCryptoIndex];
}

export const cryptoManager = {
    updatePrice,
    switchNextCrypto,
    selectCrypto,
    getCurrentPair
};