// config/preloader-config.js

export const preloaderConfig = {
    enabled: false,

    /**
     * Настройки текста.
     */
    texts: {
        initialTopText: 'Инициализация...',
        bottomText: 'Загрузка...',
        // НОВЫЙ ТЕКСТ: Появляется перед "ошибкой"
        phase2_topText: 'Синхронизация...', 
        errorStateText: 'Ошибка 20208',
        finalPercentage: 1488
    },

    /**
     * Настройки анимации затухания букв для нижнего текста.
     */
    textAnimation: {
        enabled: true,
        fadeInterval: 200,
        lettersToFade: 3
    },

    /**
     * Настройки полосы загрузки.
     */
    progressBar: {
        errorStateWidth: '1300%'
    },

    /**
     * Настройки таймингов (в миллисекундах).
     */
    timings: {
        phase1_interval: 20,
        phase1_bottomTextColorReset: 5000,
        // НОВЫЙ ТАЙМИНГ: Задержка перед показом текста "Синхронизация данных..."
        phase2_textAppearDelay: 500,
        phase2_interval: 50,
        phase3_fadeOutDelay: 1000,
        phase3_cleanupDelay: 500
    }
};