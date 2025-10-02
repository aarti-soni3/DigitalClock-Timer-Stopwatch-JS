//#region Helper Functions

const getElementById = (id) => {
    return document.getElementById(id);
}

const setTextContentByID = (id, text) => {
    getElementById(id).textContent = text;
}

const getTextContentByID = (id) => {
    return getElementById(id).textContent;
}

const formatTime = (time) => {
    return time.toString().padStart(2, 0);
    
}

//#endregion

//#region Main Functionality

const getCurrentTime = () => {
    const now = new Date();//
    
    setTextContentByID('clock-hours', formatTime(now.getHours() % 12 || 12));
    setTextContentByID('clock-minutes', formatTime(now.getMinutes()));
    setTextContentByID('clock-seconds', formatTime(now.getSeconds()));
    setTextContentByID('clock-ampm', now.getHours() >= 12 ? 'PM' : 'AM');
}

const convertMilisecondsToTime = (miliseconds) => {
    let totalSeconds = Math.floor(miliseconds / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    let ms = miliseconds % 1000;
    
    let formattedHours = formatTime(hours);
    let formattedMinutes = formatTime(minutes);
    let formattedSeconds = formatTime(seconds);
    let formattedMiliseconds = (ms / 10).toFixed(0).toString().padStart(2, '0');
    
    return [formattedHours, formattedMinutes, formattedSeconds, formattedMiliseconds];
}

setInterval(() => {
    getCurrentTime();
}, 100);

const resetLapData = () => {
    lapData = [];
    getElementById('lap').innerHTML = '';
}
//#endregion Main Functionality


/* #region UI Logic */

const onStopWatchButtonClick = () => {
    getElementById('stopwatch').removeAttribute('hidden');
    getElementById('clock').setAttribute('hidden', true);
    getElementById('timer').setAttribute('hidden', true);
    setTextContentByID('type', "Stopwatch");

}

let stopWatchInterval = null;
let lapData = [];

const onStopwatchStartBtnClick = () => {
    
    if (stopWatchInterval)
        clearInterval(stopWatchInterval);
    
    getElementById('stopwatch-lapBtn').removeAttribute('hidden');
    getElementById('stopwatch-startBtn').setAttribute('hidden', true);
    
    let startTime = Date.now();
    
    stopWatchInterval = setInterval(() => {
        let difference = Date.now() - startTime;
        
        let [hours, minutes, seconds, miliseconds] = convertMilisecondsToTime(difference);
        
        console.log(hours, minutes, seconds);
        
        setTextContentByID('stopwatch-hours', hours);
        setTextContentByID('stopwatch-minutes', minutes);
        setTextContentByID('stopwatch-seconds', seconds);
        setTextContentByID('stopwatch-miliseconds', miliseconds);
    }, 10);
}

const onStopwatchResetBtnClick = () => {
    if (stopWatchInterval)
        clearInterval(stopWatchInterval);
    stopWatchInterval = null;
    resetLapData();
    
    setTextContentByID('stopwatch-hours', '00');
    setTextContentByID('stopwatch-minutes', '00');
    setTextContentByID('stopwatch-seconds', '00');
    setTextContentByID('stopwatch-miliseconds', '00');
    getElementById('stopwatch-startBtn').removeAttribute('hidden');
    getElementById('stopwatch-lapBtn').setAttribute('hidden', true);
}

let lapId = 0;
const onLapBtnClick = () => {
    let hours = getTextContentByID('stopwatch-hours');
    let minutes = getTextContentByID('stopwatch-minutes');
    let seconds = getTextContentByID('stopwatch-seconds');
    let miliseconds = getTextContentByID('stopwatch-miliseconds');

    let lapTime = `${hours}:${minutes}:${seconds}.${miliseconds}`;
    lapData.push(lapTime);

    let lapHTML = lapData.map((lap, index) => {
        return `<div class = "lap-container"> <p> Lap${index + 1}</p> <p> ${lap}</p> </div>`;
    }).reverse().join('');
    getElementById('lap').innerHTML = lapHTML;
}

const onStopWatchBackBtnClick = () => {
    getElementById('clock').removeAttribute('hidden');
    getElementById('stopwatch').setAttribute('hidden', true);
    getElementById('timer').setAttribute('hidden', true);
    setTextContentByID('type', "Clock");
}

const onTimerBackBtnClick = () => {
    getElementById('clock').removeAttribute('hidden');
    getElementById('stopwatch').setAttribute('hidden', true);
    getElementById('timer').setAttribute('hidden', true);
    setTextContentByID('type', "Clock");
}

const onTimerButtonClick = () => {
    getElementById('timer').removeAttribute('hidden');
    getElementById('clock').setAttribute('hidden', true);
    getElementById('stopwatch').setAttribute('hidden', true);
    setTextContentByID('type', "Timer");
}

/* #endregion */

/* #region Event Handlers */

getElementById('stopwatch-startBtn').addEventListener('click', onStopwatchStartBtnClick);
getElementById('stopwatch-resetBtn').addEventListener('click', onStopwatchResetBtnClick);
getElementById('stopwatch-lapBtn').addEventListener('click', onLapBtnClick);
getElementById('stopwatch-backBtn').addEventListener('click', onStopWatchBackBtnClick);
getElementById('timer-backBtn').addEventListener('click', onTimerBackBtnClick);
getElementById('stopwatchBtn').addEventListener('click', onStopWatchButtonClick);
getElementById('timerBtn').addEventListener('click', onTimerButtonClick);

/* #endregion */



