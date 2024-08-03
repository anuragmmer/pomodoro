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
    let currentStatus = STATUS_FOCUS;
    let currentTime = 0;
    let totalCompletedLoops = 0;
    let sessionStartTime = 0;
    let pausedTime = 0;
    let isStatsVisible = false;

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

    function togglePause() {
        if (setupPopup.style.display === "none") {
            isPaused = !isPaused;
            pauseText.style.display = isPaused ? "block" : "none";
            pauseText.classList.toggle("blinking", isPaused);

            if (isPaused) {
                pausedTime -= Date.now();
            } else {
                pausedTime += Date.now();
            }
        }
    }

    function toggleStats() {
        if (setupPopup.style.display === "none") {
            isStatsVisible = !isStatsVisible;
            if (isStatsVisible) {
                timer.style.opacity = "0";
                timer.style.pointerEvents = "none";
                stats.style.opacity = "1";
                stats.style.pointerEvents = "auto";
            } else {
                timer.style.opacity = "1";
                timer.style.pointerEvents = "auto";
                stats.style.opacity = "0";
                stats.style.pointerEvents = "none";
            }
        }
    }

    startBtn.addEventListener("click", function () {
        focusTime = parseInt(document.getElementById("focus-time").value) || 25;
        restTime = parseInt(document.getElementById("rest-time").value) || 5;
        loops = parseInt(document.getElementById("loops").value) || 1;

        setupPopup.style.display = "none";
        enableTimer();
        currentLoop = 0;
        totalFocusTime = 0;
        totalBreakTime = 0;
        sessionStartTime = Date.now();
        pausedTime = 0;
        isStatsVisible = false;
        startTimer(focusTime * 60, STATUS_FOCUS);
    });

    function startTimer(duration, status) {
        currentTime = duration;
        currentStatus = status;
        statusDisplay.textContent = status;
        timeDisplay.textContent = formatTime(currentTime);

        clearInterval(interval);
        interval = setInterval(() => {
            if (!isPaused) {
                currentTime--;
                timeDisplay.textContent = formatTime(currentTime);

                updateStats();

                if (currentTime <= 0) {
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
                            totalCompletedLoops += loops;
                            loopSound.play();
                            isStatsVisible = true;
                            toggleStats();
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
        let currentSessionTime = Math.floor((Date.now() - sessionStartTime - pausedTime) / 1000);
        let currentFocusTime = totalFocusTime;
        let currentBreakTime = totalBreakTime;

        if (currentStatus === STATUS_FOCUS) {
            currentFocusTime += Math.floor((focusTime * 60 - currentTime) / 60);
        } else if (currentStatus === STATUS_RELAX) {
            currentBreakTime += Math.floor((restTime * 60 - currentTime) / 60);
        }

        document.getElementById("total-focus-time").textContent = currentFocusTime;
        document.getElementById("total-break-time").textContent = currentBreakTime;
        document.getElementById("loops-completed").textContent = totalCompletedLoops + currentLoop;
        document.getElementById("loops-remaining").textContent = loops - currentLoop;
    }

    timer.addEventListener("click", togglePause);

    document.addEventListener("keydown", function(event) {
        if (event.code === "Space") {
            event.preventDefault(); // Scroll lock hehe
            togglePause();
        } else if (event.key === "i" || event.key === "s") {
            toggleStats();
        }
    });

    document.body.addEventListener("touchstart", function (e) {
        touchStartY = e.changedTouches[0].clientY;
    });

    document.body.addEventListener("touchend", function (e) {
        let touchEndY = e.changedTouches[0].clientY;
        if (setupPopup.style.display === "none") {
            if (touchStartY - touchEndY > 30) {
                // Swipe up hehe
                console.log("Swiped up");
                toggleStats();
            } else if (touchEndY - touchStartY > 30) {
                // Swipe down hehe
                console.log("Swiped down");
                toggleStats();
            }
        }
    });
});
