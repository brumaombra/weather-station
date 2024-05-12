import { reactive } from 'vue';

export default reactive({
    initDone: false, // If the init has already been executed
    aggregatedMeasurementsList: { count: 0, results: [] }, // List of measurements for the chart view
    periodSelect: 'D', // Selected period
    startDate: '', // Start date
    endDate: '', // End date
    dialogFilter: { // Filter dialog properties
        startDate: '', // Start date
        endDate: '' // End date
    }
});