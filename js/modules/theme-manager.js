// St/js/modules/theme-manager.js
import { audioManager } from '../../sound/sound-manager.js';
import { matrixEffect } from '../effects/matrix.js';
import { neonEffect } from '../effects/neon.js';
import { cryptoEffect } from '../effects/crypto.js';
import { slepEffect } from '../effects/slep.js';
import { setupCountdown } from './countdown.js'; // <-- ИМПОРТИРУЕМ НАШ ТАЙМЕР
import { themeConfig } from '../../config/theme-config.js';

const allThemes = ['default', 'matrix', 'neon', 'crypto', 'slep'];
const activeThemes = allThemes.filter(theme => themeConfig[theme]);

const animationHandlers = {
    'matrix': matrixEffect,
    'neon': neonEffect,
    'crypto': cryptoEffect,
    'slep': slepEffect
};

let currentThemeIndex = 0;
let activeAnimation = null;
let isChangingTheme = false;

async function changeTheme(currentCryptoSymbol) {
    if (isChangingTheme) {
        return;
    }
    isChangingTheme = true;

    try {
        if (activeAnimation && activeAnimation.stop) {
            await activeAnimation.stop();
            activeAnimation = null;
        }

        document.body.className = document.body.className.replace(/theme-\S+/g, '').trim();
        document.body.classList.remove('crypto-theme-active');


        currentThemeIndex = (currentThemeIndex + 1) % activeThemes.length;
        const nextThemeName = activeThemes[currentThemeIndex];
        const nextTheme = nextThemeName === 'default' ? 'default' : `theme-${nextThemeName}`;

        // ВЫЗЫВАЕМ ПЕРЕНАСТРОЙКУ ТАЙМЕРА ПРИ КАЖДОЙ СМЕНЕ ТЕМЫ
        setupCountdown(nextTheme);

        audioManager.playTheme(nextThemeName);

        if (nextThemeName === 'crypto') {
            document.body.classList.add('crypto-theme-active');
        }

        if (nextTheme !== 'default') {
            document.body.classList.add(nextTheme);
            if (animationHandlers[nextThemeName]) {
                activeAnimation = animationHandlers[nextThemeName];
                if (nextThemeName === 'crypto' && currentCryptoSymbol) {
                    activeAnimation.setup(currentCryptoSymbol);
                } else {
                    activeAnimation.setup();
                }
            }
        }
    } finally {
        isChangingTheme = false;
    }
}

function isCurrentTheme(themeName) {
    return document.body.classList.contains(`theme-${themeName}`);
}

function getCurrentTheme() {
    const currentThemeName = activeThemes[currentThemeIndex];
    return currentThemeName === 'default' ? 'default' : `theme-${currentThemeName}`;
}

async function stopCurrentAnimation() {
     if (activeAnimation && activeAnimation.stop) {
        await activeAnimation.stop();
    }
}

function startCryptoAnimation(symbol) {
    activeAnimation = animationHandlers['crypto'];
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