export const useChartsStore = () => useState('charts', () => ({
    initDone: false, // If the init has already been executed
    aggregatedMeasurementsList: { count: 0, results: [] }, // List of measurements for the chart view
    periodSelect: 'D', // Selected period
    startDate: '', // Start date
    endDate: '', // End date
    dialogFilter: { // Filter dialog properties
        startDate: '', // Start date
        endDate: '' // End date
    }, currentDataCards: {
        percentageDifference: {
            temperature: 0,
            humidity: 0,
            pressure: 0,
            gas: 0,
            pm1: 0,
            pm25: 0,
            pm10: 0
        }
    }
}));