import { reactive } from 'vue';

export default reactive({
    measurementsList: [], // List of measurements
    busy: false, // Global busy state
    firstMeasurementsViewInit: false // First time init for view measurements
});