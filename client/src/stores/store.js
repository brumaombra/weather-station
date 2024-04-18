import { reactive } from 'vue';

export default reactive({
    measurementsList: { count: 0, results: [] }, // List of measurements for the table view
    measurementsListChart: { count: 0, results: [] }, // List of measurements for the chart view
    busy: false, // Global busy state
    toast: { // Message toast data
        visible: false,
        message: '',
        type: 'success'
    }
});