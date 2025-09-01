// St/js/modules/crypto-manager.js
import { cryptoPairs } from '/config/crypto-config.js';
import { themeManager } from './theme-manager.js';

let currentCryptoIndex = 0;

function updateTicker(symbol) {
    const tickerEl = document.getElementById('crypto-ticker');
    if (tickerEl) {
        tickerEl.textContent = symbol.replace('USDT', '/USDT');
    }
}

function switchNextCrypto() {
    currentCryptoIndex = (currentCryptoIndex + 1) % cryptoPairs.length;
    const nextPair = cryptoPairs[currentCryptoIndex];
    
    updateTicker(nextPair.symbol);
    
    if (themeManager.isCurrentTheme('crypto')) {
        themeManager.stopCurrentAnimation();
        themeManager.startCryptoAnimation(nextPair.symbol);
    }
}

// Принимаем index и pair как аргументы
function selectCrypto(index, pair) {
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
    switchNextCrypto,
    selectCrypto,
    getCurrentSymbol
};
