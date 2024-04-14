import { reactive } from 'vue';

export default reactive({
    measurementsList: [], // List of measurements for the table view
    measurementsListChart: [], // List of measurements for the chart view
    busy: false, // Global busy state
    toast: { // Message toast data
        visible: false,
        message: '',
        type: 'success'
    }
});