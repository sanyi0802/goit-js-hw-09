import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const startButton = document.querySelector('[data-start]');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

startButton.disabled = true;

let selectedDate = null;
let countdownInterval = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const currentDate = new Date();
        if (selectedDates[0] <= currentDate) {
            Notiflix.Notify.failure('Please choose a date in the future');
            startButton.disabled = true;
        } else {
            selectedDate = selectedDates[0];
            startButton.disabled = false;
        }
    },
};

flatpickr('#datetime-picker', options);

startButton.addEventListener('click', () => {
    startButton.disabled = true;
    countdownInterval = setInterval(() => {
        const currentTime = new Date();
        const timeLeft = selectedDate - currentTime;
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            return;
        }
        updateTimerDisplay(convertMs(timeLeft));
    }, 1000);
});

function updateTimerDisplay({ days, hours, minutes, seconds }) {
    daysSpan.textContent = addLeadingZero(days);
    hoursSpan.textContent = addLeadingZero(hours);
    minutesSpan.textContent = addLeadingZero(minutes);
    secondsSpan.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}