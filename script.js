document.addEventListener("DOMContentLoaded", function () {
    const setupPopup = document.getElementById("setup-popup");
    const startBtn = document.getElementById("start-btn");
    const timer = document.getElementById("timer");
    const timeDisplay = document.getElementById("time");
    const statusDisplay = document.getElementById("status");
    const pauseText = document.getElementById("pause-text");
    const stats = document.getElementById("stats");

    const endSound = document.getElementById("end-sound");
    const relaxSound = document.getElementById("relax-sound");
    const loopSound = document.getElementById("loop-sound");

    const STATUS_FOCUS = "Focus";
    const STATUS_RELAX = "Relax";

    let focusTime, restTime, loops;
    let interval, currentLoop = 0, totalFocusTime = 0, totalBreakTime = 0, isPaused = false;
    let touchStartY = 0;

    function disableTimer() {
        timer.style.opacity = "0";
        timer.style.pointerEvents = "none";
        stats.style.opacity = "0";
        stats.style.pointerEvents = "none";
        pauseText.style.display = "none";
        clearInterval(interval);
    }

    function enableTimer() {
        timer.style.opacity = "1";
        timer.style.pointerEvents = "auto";
        stats.style.opacity = "0";
        stats.style.pointerEvents = "none";
        pauseText.style.display = "none";
    }

    function preloadSound(audioElement) {
        return new Promise((resolve) => {
            audioElement.addEventListener('canplaythrough', resolve, { once: true });
        });
    }

    Promise.all([
        preloadSound(endSound),
        preloadSound(relaxSound),
        preloadSound(loopSound)
    ]).then(() => {
        console.log('All sounds are ready');
    });

    startBtn.addEventListener("click", function () {
        focusTime = parseInt(document.getElementById("focus-time").value) || 25;
        restTime = parseInt(document.getElementById("rest-time").value) || 5;
        loops = parseInt(document.getElementById("loops").value) || 1;

        setupPopup.style.display = "none";
        enableTimer();
        startTimer(focusTime * 60, STATUS_FOCUS);
    });

    function startTimer(duration, status) {
        let time = duration;
        statusDisplay.textContent = status;
        timeDisplay.textContent = formatTime(time);

        interval = setInterval(() => {
            if (!isPaused) {
                time--;
                timeDisplay.textContent = formatTime(time);

                if (time <= 0) {
                    clearInterval(interval);
                    if (status === STATUS_FOCUS) {
                        totalFocusTime += focusTime;
                        endSound.play();
                        startTimer(restTime * 60, STATUS_RELAX);
                    } else if (status === STATUS_RELAX) {
                        totalBreakTime += restTime;
                        currentLoop++;
                        if (currentLoop < loops) {
                            startTimer(focusTime * 60, STATUS_FOCUS);
                        } else {
                            loopSound.play();
                            timer.style.opacity = "0";
                            timer.style.pointerEvents = "none";
                            stats.style.opacity = "1";
                            stats.style.pointerEvents = "auto";
                            updateStats();

                            setTimeout(() => {
                                setupPopup.style.display = "flex";
                            }, 10000);
                        }
                    }
                }
            }
        }, 1000);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updateStats() {
        document.getElementById("total-focus-time").textContent = totalFocusTime;
        document.getElementById("total-break-time").textContent = totalBreakTime;
        document.getElementById("loops-completed").textContent = currentLoop;
        document.getElementById("loops-remaining").textContent = loops - currentLoop;
    }

    timer.addEventListener("click", function () {
        if (setupPopup.style.display === "none") {
            isPaused = !isPaused;
            pauseText.style.display = isPaused ? "block" : "none";
            pauseText.classList.toggle("blinking", isPaused);
        }
    });

    document.body.addEventListener("touchstart", function (e) {
        touchStartY = e.changedTouches[0].clientY;
    });

    document.body.addEventListener("touchend", function (e) {
        let touchEndY = e.changedTouches[0].clientY;
        if (setupPopup.style.display === "none") {
            if (touchStartY - touchEndY > 30) {
                // Swipe up
                console.log("Swiped up");
                timer.style.opacity = "0";
                timer.style.pointerEvents = "none";
                stats.style.opacity = "1";
                stats.style.pointerEvents = "auto";
            } else if (touchEndY - touchStartY > 30) {
                // Swipe down
                console.log("Swiped down");
                timer.style.opacity = "1";
                timer.style.pointerEvents = "auto";
                stats.style.opacity = "0";
                stats.style.pointerEvents = "none";
            }
        }
    });
});
