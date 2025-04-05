import { useGlobalStore } from '~/composables/stores/useGlobalStore.js';
import { formatJsDateToIsoStringDate } from '~/utils/formatter.js';

// Custom error class
export class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CustomError';
        this.isCustom = true;
    }
}

// Clone an object
export const cloneObject = obj => {
    return JSON.parse(JSON.stringify(obj));
};

// Set the busy state of the app
export const setBusy = busy => {
    const globalStore = useGlobalStore();
    if (globalStore.value.busy === busy) return; // Exit if it's already equal
    globalStore.value.busy = busy;
};

// Show the message toast
export const showToast = (message, type, time) => {
    const globalStore = useGlobalStore();
    globalStore.value.toast.message = message;
    globalStore.value.toast.type = type;
    globalStore.value.toast.visible = true;
    setTimeout(() => { // Hide the toast after specified time
        globalStore.value.toast.visible = false; // Hide the toast
    }, time || 3000);
};

// Show the message dialog
export const showMessageDialog = (message, type, title) => {
    const globalStore = useGlobalStore();
    globalStore.value.dialog.title = title;
    globalStore.value.dialog.message = message;
    globalStore.value.dialog.type = type;
    globalStore.value.dialog.visible = true;
};

// Convert days in milliseconds
export const fromDaysToMilliseconds = days => {
    return days * 24 * 60 * 60 * 1000;
};

// Get min and max date from a date
export const getMaxAndMinFromDate = date => {
    if (!date) return { minDate: null, maxDate: null }; // If no date, exit
    const minDate = new Date(date);
    minDate.setHours(0, 0, 0, 0);
    const maxDate = new Date(date);
    maxDate.setHours(23, 59, 59, 999);
    return { minDate, maxDate };
};

// Get percentage difference between two numbers
export const getPercentageDifference = (start, end) => {
    if (typeof start !== 'number' || typeof end !== 'number') return 0; // If no data, exit
    let percentageDifference = 100 * Math.abs((start - end) / ((start + end) / 2));
    if (start > end) percentageDifference = 0 - percentageDifference;
    return percentageDifference.toFixed(0); // Return the percentage difference
};

// Get last week date
export const getLastWeekDate = () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 7);
    const startDate = getMaxAndMinFromDate(pastDate).minDate;
    return formatJsDateToIsoStringDate(startDate, true);
};