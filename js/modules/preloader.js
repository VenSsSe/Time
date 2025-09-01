// js/modules/preloader.js
import { preloaderConfig } from '../../config/preloader-config.js';

function startPreloader(onFinished) {
    const preloader = document.getElementById('preloader');
    const appContainer = document.getElementById('app-container');

    if (!preloaderConfig.enabled) {
        preloader.style.display = 'none';
        appContainer.style.opacity = '1';
        appContainer.style.pointerEvents = 'auto';
        onFinished();
        return;
    }

    const topText = document.getElementById('preloader-top-text');
    const progressBar = document.getElementById('progress-bar');
    const percentageText = document.getElementById('percentage-text');
    const bottomText = document.getElementById('preloader-bottom-text');
    
    topText.textContent = preloaderConfig.texts.initialTopText;
    bottomText.innerHTML = preloaderConfig.texts.bottomText
        .split('')
        .map(char => `<span>${char}</span>`)
        .join('');
    const bottomTextSpans = bottomText.querySelectorAll('span');
    
    let textAnimationInterval;

    function handleTextAnimation() {
        if (!preloaderConfig.textAnimation.enabled) return;
        bottomTextSpans.forEach(span => span.style.opacity = '1');
        const lettersToFadeCount = Math.min(preloaderConfig.textAnimation.lettersToFade, bottomTextSpans.length);
        const spansArray = Array.from(bottomTextSpans);
        for (let i = 0; i < lettersToFadeCount; i++) {
            const randomIndex = Math.floor(Math.random() * spansArray.length);
            spansArray[randomIndex].style.opacity = '0.3';
            spansArray.splice(randomIndex, 1);
        }
    }
    
    appContainer.style.opacity = '0';
    appContainer.style.pointerEvents = 'none';

    let percentage = 0;
    let progressInterval;

    preloader.classList.add('preloader-fade-in');
    bottomText.classList.add('neon-green-text');
    progressBar.classList.add('neon-green-bar');
    if (preloaderConfig.textAnimation.enabled) {
        textAnimationInterval = setInterval(handleTextAnimation, preloaderConfig.textAnimation.fadeInterval);
    }

    progressInterval = setInterval(() => {
        if (percentage < 100) {
            percentage++;
            percentageText.textContent = `${percentage}%`;
            progressBar.style.width = `${percentage}%`;
        } else {
            clearInterval(progressInterval);
            phase2();
        }
    }, preloaderConfig.timings.phase1_interval);

    setTimeout(() => bottomText.classList.remove('neon-green-text'), preloaderConfig.timings.phase1_bottomTextColorReset);

    function phase2() {
        clearInterval(textAnimationInterval);
        bottomTextSpans.forEach(span => span.style.opacity = '1');
        
        // ВОССТАНОВЛЕННАЯ ЛОГИКА: Показываем промежуточный текст
        topText.textContent = preloaderConfig.texts.phase2_topText;
        topText.style.opacity = '1';

        // А уже потом, с задержкой, показываем "ошибку"
        setTimeout(() => {
            preloader.classList.remove('preloader-fade-in');
            preloader.classList.add('preloader-error-state');
            topText.classList.add('neon-yellow-text');
            progressBar.classList.remove('neon-green-bar');
            progressBar.classList.add('neon-red-bar');
            
            topText.textContent = preloaderConfig.texts.errorStateText;
            progressBar.style.width = preloaderConfig.progressBar.errorStateWidth;

            let finalPercentage = 100;
            const finalInterval = setInterval(() => {
                if (finalPercentage < preloaderConfig.texts.finalPercentage) {
                    finalPercentage += Math.ceil(Math.random() * 100);
                    if (finalPercentage > preloaderConfig.texts.finalPercentage) {
                        finalPercentage = preloaderConfig.texts.finalPercentage;
                    }
                    percentageText.textContent = `${finalPercentage}%`;
                } else {
                    clearInterval(finalInterval);
                    finishLoading();
                }
            }, preloaderConfig.timings.phase2_interval);
        }, preloaderConfig.timings.phase2_textAppearDelay);
    }

    function finishLoading() {
        setTimeout(() => {
            preloader.style.opacity = '0';
            appContainer.style.opacity = '1';
            appContainer.style.pointerEvents = 'auto';
            
            setTimeout(() => {
                preloader.style.display = 'none';
                if (onFinished && typeof onFinished === 'function') {
                    onFinished();
                }
            }, preloaderConfig.timings.phase3_cleanupDelay);
        }, preloaderConfig.timings.phase3_fadeOutDelay);
    }
}

export { startPreloader };