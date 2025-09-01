// js/main.js

// --- Импорт модулей ---
import { startPreloader } from './modules/preloader.js';
import { setupEventListeners } from './modules/event-handlers.js';
import { setupCountdown } from './modules/countdown.js';
import { themeManager } from './modules/theme-manager.js';
import { cryptoManager } from './modules/crypto-manager.js';

/**
 * Главная функция инициализации приложения.
 * Запускается после завершения работы предзагрузчика.
 */
function initializeApp() {
    // 1. Получаем текущую тему при запуске
    const currentTheme = themeManager.getCurrentTheme();
    
    // 2. Настраиваем и запускаем таймер обратного отсчета на основе этой темы
    setupCountdown(currentTheme);
    
    // 3. Настраиваем все обработчики событий (клики, нажатия)
    setupEventListeners(themeManager, cryptoManager);
}

// --- Точка входа в приложение ---
document.addEventListener('DOMContentLoaded', () => {
    // Теперь preloader сам решает, когда вызвать initializeApp
    startPreloader(initializeApp);
});