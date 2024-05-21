import { reactive } from 'vue';

export default reactive({
    initTableDone: false, // If the init has already been executed
    measurementsList: { count: 0, results: [] }, // List of measurements for the table view
    tempMeasurement: {}, // Item temp value
    selectedElements: [], // Mass delete button
    selectedAll: false, // Select all checkbox value
    orderBy: 'timestamp', // The order field
    orderDirection: 'desc', // The order direction
    startDate: '', // Start date
    endDate: '', // End 
    offset: 0, // Offset for pagination
    limit: 10, // Limit for pagination
    dialogFilter: { // Filter dialog properties
        orderBy: 'timestamp', // The order field
        orderDirection: 'desc', // The order direction
        startDate: '', // Start date
        endDate: '' // End date
    }
});