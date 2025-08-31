// St/js/modules/preloader.js

/**
 * Запускает анимацию предзагрузчика и вызывает колбэк по завершении.
 * @param {function} onFinished - Функция, которая будет вызвана после завершения анимации.
 */
function startPreloader(onFinished) {
    const preloader = document.getElementById('preloader');
    const topText = document.getElementById('preloader-top-text');
    const progressBar = document.getElementById('progress-bar');
    const percentageText = document.getElementById('percentage-text');
    const bottomText = document.getElementById('preloader-bottom-text');
    const bottomTextSpans = bottomText.querySelectorAll('span');
    const appContainer = document.getElementById('app-container');
    
    appContainer.style.opacity = '0';
    appContainer.style.pointerEvents = 'none';

    let percentage = 0;
    let progressInterval;

    // --- Фаза 1: 0-100% ---
    preloader.classList.add('preloader-fade-in');
    bottomText.classList.add('neon-green-text');
    progressBar.classList.add('neon-green-bar');

    progressInterval = setInterval(() => {
        if (percentage < 100) {
            percentage++;
            percentageText.textContent = `${percentage}%`;
            progressBar.style.width = `${percentage}%`;
        } else {
            clearInterval(progressInterval);
            phase2();
        }
    }, 60);

    setTimeout(() => { topText.textContent = 'Найди'; topText.style.opacity = '1'; }, 500);
    setTimeout(() => { topText.style.opacity = '0'; }, 1800);
    setTimeout(() => { topText.textContent = 'все'; topText.style.opacity = '1'; }, 2300);
    setTimeout(() => { topText.style.opacity = '0'; }, 3600);
    setTimeout(() => { topText.textContent = 'пасхалии'; topText.style.opacity = '1'; }, 4100);
    setTimeout(() => { topText.style.opacity = '0'; }, 5400);

    setTimeout(() => bottomTextSpans[7].classList.add('fade-out'), 2000);
    setTimeout(() => bottomTextSpans[6].classList.add('fade-out'), 3000);
    setTimeout(() => bottomTextSpans[1].classList.add('fade-out'), 4000);
    setTimeout(() => {
        bottomTextSpans[0].classList.add('fade-out');
        bottomText.classList.remove('neon-green-text');
        bottomText.classList.add('neon-yellow-text');
    }, 5000);

    // --- Фаза 2: "Ошибка" ---
    function phase2() {
        preloader.classList.remove('preloader-fade-in');
        preloader.classList.add('preloader-error-state');
        topText.classList.add('neon-yellow-text');
        progressBar.classList.remove('neon-green-bar');
        progressBar.classList.add('neon-red-bar');
        topText.textContent = 'Ошибка 228';
        topText.style.opacity = '1';
        progressBar.style.width = `130%`; 

        let finalPercentage = 100;
        const finalInterval = setInterval(() => {
            if (finalPercentage < 1488) {
                finalPercentage += Math.ceil(Math.random() * 100); 
                if(finalPercentage > 1488) finalPercentage = 1488;
                percentageText.textContent = `${finalPercentage}%`;
            } else {
                clearInterval(finalInterval);
                finishLoading();
            }
        }, 50);
    }

    // --- Фаза 3: Завершение ---
    function finishLoading() {
        setTimeout(() => {
            preloader.style.opacity = '0';
            appContainer.style.opacity = '1';
            appContainer.style.pointerEvents = 'auto';
            
            setTimeout(() => {
                preloader.style.display = 'none';
                if (typeof onFinished === 'function') {
                    onFinished();
                }
            }, 500);
        }, 500);
    }
}

export { startPreloader };
