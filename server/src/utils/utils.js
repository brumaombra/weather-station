// Get min and max date from a date
export const getMaxAndMinFromDate = date => {
    let minDate = new Date(date);
    minDate.setHours(0, 0, 0, 0);
    let maxDate = new Date(date);
    maxDate.setHours(23, 59, 59, 999);
    return { minDate, maxDate };
};