// St/js/modules/countdown.js

const targetDate = new Date(2026, 5, 1, 15, 0, 0).getTime();
let countdownInterval;

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

function setupCountdown(showTimer) {
    if (showTimer) {
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
