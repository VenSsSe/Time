// config/timer-config.js

/**
 * Конфигурация таймера для каждой темы.
 * * Вы можете:
 * - Включить/выключить таймер (showTimer: true/false)
 * - Установить целевую дату (targetDate)
 * * Формат даты: new Date(год, месяц, день, часы, минуты, секунды)
 * ВАЖНО: месяцы в JavaScript начинаются с 0 (январь) до 11 (декабрь).
 */
export const timerConfig = {
    'default': {
        showTimer: true,
        targetDate: new Date(2025, 12, 31, 23, 59, 59) // 31 декабря 2025
    },
    'theme-matrix': {
        showTimer: true,
        targetDate: new Date(2026, 4, 10, 0, 0, 0) // 1 января 2026
    },
    'theme-neon': {
        showTimer: true,
        targetDate: new Date(2033, 4, 1, 12, 0, 0) // 1 мая 2027
    },
    'theme-crypto': {
        showTimer: true,
        targetDate: new Date(2033, 4, 1, 12, 0, 0) // 1 мая 2027
    }
};