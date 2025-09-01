// js/modules/countdown.js

import { timerConfig } from '../../config/timer-config.js';

let countdownInterval;
let targetDate;

const els = {
    daysEl: document.getElementById('days'),
    hoursEl: document.getElementById('hours'),
    minutesEl: document.getElementById('minutes'),
    secondsEl: document.getElementById('seconds'),
    countdownContainer: document.getElementById('countdown-container'),
    comingSoonContainer: document.getElementById('coming-soon-container'),
    finishedMessage: document.getElementById('finished-message'),
    actionButtons: document.getElementById('action-buttons'),
};

function updateCountdown() {
    const distance = targetDate - new Date().getTime();
    if (distance < 0) {
        clearInterval(countdownInterval);
        els.countdownContainer.classList.add('hidden');
        els.comingSoonContainer.classList.add('hidden');
        els.actionButtons.classList.add('hidden');
        els.finishedMessage.classList.remove('hidden');
        return;
    }
    const format = (val) => String(val).padStart(2, '0');
    els.daysEl.textContent = String(Math.floor(distance / (1000 * 60 * 60 * 24)));
    els.hoursEl.textContent = format(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    els.minutesEl.textContent = format(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    els.secondsEl.textContent = format(Math.floor((distance % (1000 * 60)) / 1000));
}

function setupCountdown(currentTheme) {
    // 1. Очищаем предыдущий интервал, чтобы таймеры не накладывались
    clearInterval(countdownInterval);
    
    // 2. Сбрасываем видимость всех связанных элементов
    els.countdownContainer.classList.add('hidden');
    els.comingSoonContainer.classList.add('hidden');
    els.finishedMessage.classList.add('hidden');
    els.actionButtons.classList.remove('hidden'); // Показываем кнопки по умолчанию

    // 3. Получаем настройки для текущей темы из конфига
    const config = timerConfig[currentTheme] || timerConfig['default'];

    if (config.showTimer && config.targetDate) {
        targetDate = new Date(config.targetDate).getTime();
        
        els.comingSoonContainer.classList.add('hidden');
        els.countdownContainer.classList.remove('hidden');
        
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
    } else {
        els.countdownContainer.classList.add('hidden');
        els.comingSoonContainer.classList.remove('hidden');
    }
}

export { setupCountdown };