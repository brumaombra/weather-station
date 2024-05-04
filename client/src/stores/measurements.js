import { reactive } from 'vue';

export default reactive({
    initTableDone: false, // If the init has already been executed
    tempMeasurement: {}, // Item temp value
    selectedElements: [], // Mass delete button
    selectedAll: false, // Select all checkbox value
    orderBy: 'timestamp', // The order field
    orderDirection: 'desc', // The order direction
    startDate: '', // Start date
    endDate: '', // End date
    dialogFilter: { // Filter dialog properties
        orderBy: 'timestamp', // The order field
        orderDirection: 'desc', // The order direction
        startDate: '', // Start date
        endDate: '' // End date
    }
});