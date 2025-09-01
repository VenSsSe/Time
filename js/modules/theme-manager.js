// St/js/modules/theme-manager.js
import { audioManager } from '../../sound/sound-manager.js';
import { matrixEffect } from '../effects/matrix.js';
import { neonEffect } from '../effects/neon.js';
import { cryptoEffect } from '../effects/crypto.js';
import { setupCountdown } from './countdown.js'; // <-- ИМПОРТИРУЕМ НАШ ТАЙМЕР

const themes = ['default', 'theme-matrix', 'theme-neon', 'theme-crypto'];
const animationHandlers = {
    'theme-matrix': matrixEffect,
    'theme-neon': neonEffect,
    'theme-crypto': cryptoEffect
};

let currentThemeIndex = 0;
let activeAnimation = null;

function changeTheme(currentCryptoSymbol) {
    if (activeAnimation && activeAnimation.stop) {
        activeAnimation.stop();
        activeAnimation = null;
    }

    document.body.className = document.body.className.replace(/theme-\S+/g, '').trim();

    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const nextTheme = themes[currentThemeIndex];

    // ВЫЗЫВАЕМ ПЕРЕНАСТРОЙКУ ТАЙМЕРА ПРИ КАЖДОЙ СМЕНЕ ТЕМЫ
    setupCountdown(nextTheme);

    audioManager.playTheme(nextTheme.replace('theme-', ''));

    if (nextTheme !== 'default') {
        document.body.classList.add(nextTheme);
        if (animationHandlers[nextTheme]) {
            activeAnimation = animationHandlers[nextTheme];
            if (nextTheme === 'theme-crypto' && currentCryptoSymbol) {
                activeAnimation.setup(currentCryptoSymbol);
            } else {
                activeAnimation.setup();
            }
        }
    }
}

function isCurrentTheme(themeName) {
    return document.body.classList.contains(`theme-${themeName}`);
}

function getCurrentTheme() {
    return themes[currentThemeIndex];
}

function stopCurrentAnimation() {
     if (activeAnimation && activeAnimation.stop) {
        activeAnimation.stop();
    }
}

function startCryptoAnimation(symbol) {
    activeAnimation = animationHandlers['theme-crypto'];
    activeAnimation.setup(symbol);
}

const themeManager = {
    changeTheme,
    isCurrentTheme,
    stopCurrentAnimation,
    startCryptoAnimation,
    getCurrentTheme
};

export { themeManager };