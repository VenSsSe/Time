// St/js/modules/ui-manager.js
import { socialLinks } from '/config/links-config.js';
import { cryptoPairs } from '/config/crypto-config.js';

const imageContainer = document.querySelector('.image-container');
const actionButtons = document.getElementById('action-buttons');
const elevatorContent = document.getElementById('elevator-content');
const countdownContainer = document.getElementById('countdown-container');

function shrinkImage() {
    if (imageContainer) imageContainer.classList.add('shrink-image');
}

function expandImage() {
    if (imageContainer) imageContainer.classList.remove('shrink-image');
}

function moveContentUp() {
    if (elevatorContent) elevatorContent.classList.add('content-lifted');
    if (countdownContainer) countdownContainer.classList.add('content-moved-up');
    if (actionButtons) actionButtons.classList.add('hidden');
}

function moveContentDown() {
    if (elevatorContent) elevatorContent.classList.remove('content-lifted');
    if (countdownContainer) countdownContainer.classList.remove('content-moved-up');
    if (actionButtons) actionButtons.classList.remove('hidden');
}

function hidePanel(panel) {
    expandImage();
    moveContentDown();
    panel.classList.remove('visible');
}

/**
 * Показывает панель со ссылками на соцсети.
 * @param {string} platform - Платформа ('youtube' или 'tiktok').
 */
function showLinksPanel(platform) {
    const panel = document.getElementById('links-panel');
    const linksToShow = socialLinks[platform];
    if (!linksToShow) return;

    shrinkImage();
    moveContentUp();
    panel.innerHTML = ''; 
    const grid = document.createElement('div');
    grid.className = 'links-grid';
    linksToShow.forEach(link => {
        const button = document.createElement('a');
        button.href = link.url;
        button.target = '_blank';
        button.className = 'action-button';
        button.textContent = link.name;
        grid.appendChild(button);
    });
    const backButton = document.createElement('button');
    backButton.className = 'action-button back-button';
    backButton.textContent = 'Назад';
    backButton.onclick = () => hidePanel(panel);
    grid.appendChild(backButton);
    panel.appendChild(grid);
    panel.classList.add('visible');
}

/**
 * Показывает панель выбора криптовалют.
 * @param {function} onCryptoSelect - Колбэк, вызываемый при выборе криптовалюты.
 */
function showCryptoPanel(onCryptoSelect) {
    const panel = document.getElementById('crypto-panel');
    shrinkImage();
    moveContentUp();
    panel.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'links-grid';
    cryptoPairs.forEach((pair, index) => {
        const button = document.createElement('button');
        button.className = 'action-button crypto-button';
        button.textContent = pair.name;
        button.onclick = () => {
            if (typeof onCryptoSelect === 'function') {
                onCryptoSelect(index, pair);
            }
            hidePanel(panel);
        };
        grid.appendChild(button);
    });
    const backButton = document.createElement('button');
    backButton.className = 'action-button back-button';
    backButton.textContent = 'Назад';
    backButton.onclick = () => hidePanel(panel);
    grid.appendChild(backButton);
    panel.appendChild(grid);
    panel.classList.add('visible');
}

export { showLinksPanel, showCryptoPanel };
