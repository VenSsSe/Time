// config/timer-config.js

/**
 * Конфигурация таймера для каждой темы.
 */
export const timerConfig = {
    'default': {
        showTimer: true,
        // ИСПРАВЛЕНО: Месяц 11 - это декабрь
        targetDate: new Date(2025, 11, 31, 23, 59, 59) 
    },
    'theme-matrix': {
        showTimer: true,
        targetDate: new Date(2026, 3, 10, 0, 0, 0) // Месяц 3 - апрель
    },
    'theme-neon': {
        showTimer: true,
        targetDate: new Date(2033, 4, 1, 12, 0, 0) // Месяц 4 - май
    },
    'theme-crypto': {
        showTimer: true,
        targetDate: new Date(2033, 4, 1, 12, 0, 0) // Месяц 4 - май
    }
};