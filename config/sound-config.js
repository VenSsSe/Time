// config/sound-config.js

// Экспортируем массив с настройками звуков для каждой темы
export const sounds = [
    // Для default оставляем пустым, звука не будет
    { theme: 'default', file: '' }, 

    // ИСПРАВЛЕНО: Путь теперь корректный, относительно index.html
    { theme: 'neon', file: 'sound/neon/World.mp3' }, 
    
    // Для остальных тем пока нет звуков
    { theme: 'matrix', file: '' },
    { theme: 'crypto', file: '' }
];
