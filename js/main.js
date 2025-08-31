// St/js/main.js

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
    // Настройка, которая определяет, показывать ли таймер
    const showTimer = false; 

    // 1. Настраиваем и запускаем таймер обратного отсчета
    setupCountdown(showTimer);
    
    // 2. Настраиваем все обработчики событий (клики, нажатия)
    // Передаем менеджеры, чтобы обработчики могли вызывать их функции
    setupEventListeners(themeManager, cryptoManager);
}

// --- Точка входа в приложение ---
// Когда DOM готов, запускаем предзагрузчик.
// В качестве колбэка передаем ему функцию инициализации основного приложения.
document.addEventListener('DOMContentLoaded', () => {
    startPreloader(initializeApp);
});

