import { reactive } from 'vue';

export default reactive({
    initDone: false, // If the init has already been executed
    measurementsList: [], // List of the measurements
    periodSelect: 'D', // Selected period
    startDate: '', // Start date
    endDate: '', // End date
    dialogFilter: { // Filter dialog properties
        startDate: '', // Start date
        endDate: '' // End date
    }
});