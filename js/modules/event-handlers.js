// St/js/modules/event-handlers.js
import { showLinksPanel, showCryptoPanel } from './ui-manager.js';
import { audioManager } from '../../sound/sound-manager.js';
import { cryptoEffect } from '../effects/crypto.js'; // Import cryptoEffect
import { interactionConfig } from '../../config/interaction-config.js';

/**
 * Настраивает все обработчики событий для интерактивных элементов.
 * @param {object} themeManager - Экземпляр менеджера тем.
 * @param {object} cryptoManager - Экземпляр менеджера крипто-логики.
 */
function setupEventListeners(themeManager, cryptoManager) {

    // --- Главное изображение (смена темы и пасхалка) ---
    let imagePressTimer = null;
    let imageLongPressTriggered = false;
    let transparencyTimeout = null;

    const handleImagePressStart = (event) => {
        event.preventDefault();
        const currentThemeName = themeManager.getCurrentTheme().replace('theme-', '');
        const config = interactionConfig[currentThemeName] || interactionConfig['default'];

        imageLongPressTriggered = false;
        imagePressTimer = setTimeout(() => {
            imageLongPressTriggered = true;
            const elevatorContent = document.getElementById('elevator-content');
            elevatorContent.style.opacity = config.dimmingPercentage;
            
            if (!config.enableBackgroundInteraction) {
                elevatorContent.style.pointerEvents = 'none';
            } else {
                elevatorContent.style.pointerEvents = config.topLayerPointerEvents;
                if (config.topLayerPointerEvents === 'none') {
                    for (const child of elevatorContent.children) {
                        child.style.pointerEvents = 'none';
                    }
                }
            }

            transparencyTimeout = setTimeout(() => {
                elevatorContent.style.opacity = '1';
                elevatorContent.style.pointerEvents = ''; // Сброс стиля
                for (const child of elevatorContent.children) {
                    child.style.pointerEvents = '';
                }
            }, config.transparencyDuration);
        }, config.longPressDuration);
    };

    const handleImagePressEnd = async () => {
        clearTimeout(imagePressTimer);
        const elevatorContent = document.getElementById('elevator-content');
        if (elevatorContent.style.opacity !== '' && elevatorContent.style.opacity !== '1') {
            clearTimeout(transparencyTimeout);
            elevatorContent.style.opacity = '1';
            elevatorContent.style.pointerEvents = '';
            for (const child of elevatorContent.children) {
                child.style.pointerEvents = '';
            }
        } else if (!imageLongPressTriggered) {
            if (!document.querySelector('.links-panel.visible') && !document.querySelector('#crypto-panel.visible')) {
                await themeManager.changeTheme(cryptoManager.getCurrentPair().symbol);
            }
        }
        imageLongPressTriggered = false;
    };
    
    const addStyleChangerListeners = (element) => {
        if (!element) return;
        element.addEventListener('mousedown', handleImagePressStart);
        element.addEventListener('touchstart', handleImagePressStart, { passive: false });
        element.addEventListener('mouseup', handleImagePressEnd);
        element.addEventListener('touchend', handleImagePressEnd);
        element.addEventListener('mouseleave', () => {
            clearTimeout(imagePressTimer);
        });
    };

    addStyleChangerListeners(document.getElementById('style-changer-img'));
    addStyleChangerListeners(document.getElementById('style-changer-img-soon'));
    
    // --- Кнопки соцсетей ---
    document.getElementById('youtube-btn').addEventListener('click', () => showLinksPanel('youtube'));
    document.getElementById('tiktok-btn').addEventListener('click', () => showLinksPanel('tiktok'));

    // --- Контейнер цены (смена крипты и панель выбора) ---
    const priceContainer = document.getElementById('btc-price-container');
    let pricePressTimer = null;
    let priceLongPressTriggered = false;

    const handlePricePressStart = (event) => {
        event.preventDefault();
        const currentThemeName = themeManager.getCurrentTheme().replace('theme-', '');
        const config = interactionConfig[currentThemeName] || interactionConfig['default'];

        priceLongPressTriggered = false;
        pricePressTimer = setTimeout(() => {
            if (themeManager.isCurrentTheme('crypto')) {
                priceLongPressTriggered = true;
                const onCryptoSelect = (index, pair) => {
                    cryptoManager.selectCrypto(index);
                    cryptoEffect.updateSymbol(pair);
                };
                showCryptoPanel(onCryptoSelect);
            }
        }, config.longPressDuration);
    };

    const handlePricePressEndCrypto = () => {
        clearTimeout(pricePressTimer);
        if (themeManager.isCurrentTheme('crypto')) {
            if (!priceLongPressTriggered) {
                const nextPair = cryptoManager.switchNextCrypto();
                cryptoEffect.updateSymbol(nextPair);
            }
        }
    };

    priceContainer.addEventListener('mousedown', handlePricePressStart);
    priceContainer.addEventListener('touchstart', handlePricePressStart, { passive: false });
    priceContainer.addEventListener('mouseup', handlePricePressEndCrypto);
    priceContainer.addEventListener('touchend', handlePricePressEndCrypto);
    priceContainer.addEventListener('mouseleave', () => clearTimeout(pricePressTimer));

    // --- Переключатели таймфрейма ---
    const selectors = { day: 'day-selector', hour: 'hour-selector', minute: 'minute-selector', second: 'second-selector' };
    Object.entries(selectors).forEach(([tf, id]) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('click', () => {
            if (themeManager.isCurrentTheme('crypto')) {
                document.querySelectorAll('.timer-block.active').forEach(b => b.classList.remove('active'));
                el.classList.add('active');
                cryptoEffect.switchTimeframe(tf);
            }
        });
    });

    // --- Кнопка громкости ---
    const volumeBtn = document.getElementById('volume-btn');
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (isTouchDevice) {
        let isMuted = true;
        const updateTouchVolume = () => {
            audioManager.setVolume(isMuted ? 0 : 1);
            volumeBtn.textContent = isMuted ? 'Выкл' : 'Вкл';
        };
        volumeBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            updateTouchVolume();
        });
        updateTouchVolume();
    } else {
        const volumeLevels = [0.5, 0.75, 1, 0, 0, 0.25];
        let currentVolumeIndex = 0;
        const updateDesktopVolume = () => {
            const level = volumeLevels[currentVolumeIndex];
            audioManager.setVolume(level);
            volumeBtn.textContent = `${Math.round(level * 100)}%`;
        };
        volumeBtn.addEventListener('click', () => {
            currentVolumeIndex = (currentVolumeIndex + 1) % volumeLevels.length;
            updateDesktopVolume();
        });
        updateDesktopVolume();
    }

    // --- Разблокировка аудио ---
    document.body.addEventListener('click', () => audioManager.unlockAudio(), { once: true });
}

export { setupEventListeners };