// St/sound/sound-manager.js

// Импортируем конфигурацию звуков из отдельного файла
import { sounds } from './sound-config.js';

// Приватное состояние для менеджера (недоступно извне)
let currentAudio = new Audio();
let audioUnlocked = false;

// Создаем объект-менеджер, который будем экспортировать
const audioManager = {
    /**
     * Находит, загружает и воспроизводит звук для указанной темы.
     * @param {string} themeName - Имя темы (например, 'default', 'neon').
     */
    playTheme(themeName) {
        const soundConfig = sounds.find(s => s.theme === themeName);
        
        if (!soundConfig || !soundConfig.file) {
            currentAudio.pause(); // Если для темы нет звука, останавливаем текущий
            return;
        }

        // Не перезагружаем тот же трек, если он уже играет
        if (currentAudio.src.endsWith(soundConfig.file)) {
            if (audioUnlocked && currentAudio.paused) {
                currentAudio.play().catch(e => console.error("Ошибка при возобновлении аудио:", e));
            }
            return;
        }

        currentAudio.src = soundConfig.file;
        currentAudio.loop = true;
        
        // Если пользователь уже "разблокировал" звук, сразу запускаем
        if (audioUnlocked && !currentAudio.muted) {
            currentAudio.play().catch(e => console.error("Ошибка при воспроизведении нового трека:", e));
        }
    },

    /**
     * Устанавливает громкость воспроизведения.
     * @param {number} level - Уровень громкости от 0.0 до 1.0.
     */
    setVolume(level) {
        currentAudio.volume = level;
        currentAudio.muted = (level === 0);
    },

    /**
     * "Разблокирует" возможность воспроизведения звука. 
     * Должна вызываться по первому клику пользователя на странице.
     */
    unlockAudio() {
        if (audioUnlocked) return;
        
        // Пытаемся запустить воспроизведение. Браузер разрешит это, так как это реакция на клик.
        let playPromise = currentAudio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Сразу ставим на паузу, нам нужно было только разрешение.
                if (currentAudio.src) {
                   currentAudio.pause();
                }
                audioUnlocked = true;
                console.log("Звук разблокирован пользователем.");
                
                // Теперь, когда звук разрешен, можно запустить трек, если он должен играть
                if (currentAudio.src && !currentAudio.muted) {
                    currentAudio.play().catch(e => console.error("Ошибка запуска аудио после разблокировки:", e));
                }
            }).catch(error => {
                console.error("Не удалось разблокировать звук:", error);
            });
        }
    }
};

// Экспортируем наш менеджер, чтобы его можно было импортировать в main.js
export { audioManager };

