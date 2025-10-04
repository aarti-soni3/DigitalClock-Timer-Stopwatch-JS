//#region Import Packages

import {
  getElementById,
  setTextContentByID,
  getTextContentByID,
  formatTime,
} from "./utills.js";

//#endregion Import Packages

//#region Main Functionality
const getClockTimeFromDate = (date) => {
  let hours = formatTime(date.getHours() % 12 || 12);
  let minutes = formatTime(date.getMinutes());
  let seconds = formatTime(date.getSeconds());
  let miliseconds = formatTime(date.getMilliseconds());
  let ampm = date.getHours() >= 12 ? "PM" : "AM";
  return [hours, minutes, seconds, miliseconds, ampm];
};

const getClockTimeFromMiliseconds = (miliseconds) => {
  if (miliseconds === 0) return ["00", "00", "00", "00"];

  let totalSeconds = Math.floor(miliseconds / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;
  let ms = miliseconds % 1000;

  let formattedMiliseconds = (ms / 10).toFixed(0).toString().padStart(2, "0");
  return [
    formatTime(hours),
    formatTime(minutes),
    formatTime(seconds),
    formattedMiliseconds,
  ];
};

const getMillisecondsFromMinutes = (minutes) => {
  return minutes * 60 * 1000;
};

const getMinutesFromMilliseconds = (miliseconds) => {
  return miliseconds / 1000 / 60;
};

const getCurrentTime = () => {
  const now = new Date();

  let [hours, minutes, seconds, , ampm] = getClockTimeFromDate(now);

  setTextContentByID("clock-hours", hours);
  setTextContentByID("clock-minutes", minutes);
  setTextContentByID("clock-seconds", seconds);
  setTextContentByID("clock-ampm", ampm);
};

setInterval(() => {
  getCurrentTime();
}, 100);

const resetLapData = () => {
  lapData = [];
  getElementById("lap").innerHTML = "";
};
//#endregion Main Functionality

//#region UI Logic

const onStopWatchButtonClick = () => {
  getElementById("stopwatch").removeAttribute("hidden");
  getElementById("clock").setAttribute("hidden", true);
  getElementById("timer").setAttribute("hidden", true);
  setTextContentByID("type", "Stopwatch");
};

let stopWatchInterval = null;
let lapData = [];

const onStopwatchStartBtnClick = () => {
  if (stopWatchInterval) clearInterval(stopWatchInterval);

  getElementById("stopwatch-lapBtn").removeAttribute("hidden");
  getElementById("stopwatch-startBtn").setAttribute("hidden", true);

  let startTime = Date.now();

  stopWatchInterval = setInterval(() => {
    let difference = Date.now() - startTime;
    let [hours, minutes, seconds, miliseconds] =
      getClockTimeFromMiliseconds(difference);

    setTextContentByID("stopwatch-hours", hours);
    setTextContentByID("stopwatch-minutes", minutes);
    setTextContentByID("stopwatch-seconds", seconds);
    setTextContentByID("stopwatch-miliseconds", miliseconds);
  }, 10);
};

const onStopwatchResetBtnClick = () => {
  if (stopWatchInterval) clearInterval(stopWatchInterval);
  stopWatchInterval = null;
  resetLapData();

  setTextContentByID("stopwatch-hours", "00");
  setTextContentByID("stopwatch-minutes", "00");
  setTextContentByID("stopwatch-seconds", "00");
  setTextContentByID("stopwatch-miliseconds", "00");
  getElementById("stopwatch-startBtn").removeAttribute("hidden");
  getElementById("stopwatch-lapBtn").setAttribute("hidden", true);
};

const onStopWatchBackBtnClick = () => {
  getElementById("clock").removeAttribute("hidden");
  getElementById("stopwatch").setAttribute("hidden", true);
  getElementById("timer").setAttribute("hidden", true);
  setTextContentByID("type", "Clock");
};

let lapId = 0;
const onLapBtnClick = () => {
  let hours = getTextContentByID("stopwatch-hours");
  let minutes = getTextContentByID("stopwatch-minutes");
  let seconds = getTextContentByID("stopwatch-seconds");
  let miliseconds = getTextContentByID("stopwatch-miliseconds");

  let lapTime = `${hours}:${minutes}:${seconds}.${miliseconds}`;
  lapData.push(lapTime);

  let lapHTML = lapData
    .map((lap, index) => {
      return `<div class = "lap-container"> <p> Lap${
        index + 1
      }</p> <p> ${lap}</p> </div>`;
    })
    .reverse()
    .join("");
  getElementById("lap").innerHTML = lapHTML;
};

const onTimerBackBtnClick = () => {
  getElementById("clock").removeAttribute("hidden");
  getElementById("stopwatch").setAttribute("hidden", true);
  getElementById("timer").setAttribute("hidden", true);
  setTextContentByID("type", "Clock");
};

const onTimerButtonClick = () => {
  getElementById("timer").removeAttribute("hidden");
  getElementById("clock").setAttribute("hidden", true);
  getElementById("stopwatch").setAttribute("hidden", true);
  setTextContentByID("type", "Timer");
};

let totalTimeInMiliseconds,
  timerValueInMinutes,
  timerId,
  isPause = false;

const getInputFromUser = () => {
  let time = prompt("Enter time in minutes [Enter Number] :");
  return parseInt(time);
};

const ResetTimer = () => {
  clearInterval(timerId);
  totalTimeInMiliseconds = 0;
  timerValueInMinutes = NaN;
  printTimerValue(0);
  alert("Time's Up!");
  getElementById("timer-stopBtn").setAttribute("hidden", true);
  getElementById("timer-startBtn").removeAttribute("hidden");
  isPause = false;
};

const startTimer = (timeInMinutes) => {
  const startTime = Date.now();
  const endTime = startTime + timeInMinutes * 60 * 1000;

  clearInterval(timerId);

  timerId = setInterval(() => {
    const now = Date.now();
    totalTimeInMiliseconds = Math.max(0, endTime - now);

    if (totalTimeInMiliseconds <= 0) {
      return ResetTimer();
    }
    printTimerValue(totalTimeInMiliseconds);
  }, 10); // Update every 10ms for smoother display
};

const printTimerValue = (timerValue) => {
  let [hours, minutes, seconds, miliseconds] =
    getClockTimeFromMiliseconds(timerValue);

  setTextContentByID("timer-hours", hours);
  setTextContentByID("timer-minutes", minutes);
  setTextContentByID("timer-seconds", seconds);
  setTextContentByID("timer-miliseconds", miliseconds);
};

const validateAndPrintTimerValue = (timerUserInputValue) => {
  if (Number.isInteger(timerUserInputValue)) {
    printTimerValue(getMillisecondsFromMinutes(timerUserInputValue));
  } else {
    alert("Input is not an integer number");
    timerUserInputValue = NaN;
  }
};

const onTimerStartButtonClick = () => {
  if (timerValueInMinutes === undefined || Number.isNaN(timerValueInMinutes)) {
    timerValueInMinutes = getInputFromUser();
    validateAndPrintTimerValue(timerValueInMinutes);
    return;
  }

  isPause
    ? startTimer(getMinutesFromMilliseconds(totalTimeInMiliseconds))
    : startTimer(timerValueInMinutes);
  isPause = false;

  getElementById("timer-startBtn").setAttribute("hidden", true);
  getElementById("timer-stopBtn").removeAttribute("hidden");
};

const onTimerResetButtonClick = () => {
  totalTimeInMiliseconds = 0;
  timerValueInMinutes = NaN;
  printTimerValue(totalTimeInMiliseconds);
  clearInterval(timerId);
};

const onTimerStopButtonClick = () => {
  isPause = true;
  clearInterval(timerId);

  getElementById("timer-stopBtn").setAttribute("hidden", true);
  getElementById("timer-startBtn").removeAttribute("hidden");
};

//#endregion

//#region Event Handlers

getElementById("stopwatchBtn").addEventListener(
  "click",
  onStopWatchButtonClick
);
getElementById("stopwatch-lapBtn").addEventListener("click", onLapBtnClick);
getElementById("stopwatch-startBtn").addEventListener(
  "click",
  onStopwatchStartBtnClick
);
getElementById("stopwatch-resetBtn").addEventListener(
  "click",
  onStopwatchResetBtnClick
);
getElementById("stopwatch-backBtn").addEventListener(
  "click",
  onStopWatchBackBtnClick
);
getElementById("timerBtn").addEventListener("click", onTimerButtonClick);
getElementById("timer-startBtn").addEventListener(
  "click",
  onTimerStartButtonClick
);
getElementById("timer-stopBtn").addEventListener(
  "click",
  onTimerStopButtonClick
);
getElementById("timer-resetBtn").addEventListener(
  "click",
  onTimerResetButtonClick
);
getElementById("timer-backBtn").addEventListener("click", onTimerBackBtnClick);

//#endregion
