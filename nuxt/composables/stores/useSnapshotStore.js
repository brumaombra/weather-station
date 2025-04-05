export const useSnapshotStore = () => useState('snapshot', () => ({
    initDone: false, // If the init has already been executed
    lastMeasurement: {}, // Last measurement
    measurementsList: { count: 0, results: [] }, // List of measurements
    aggregatedMeasurementsList: { count: 0, results: [] }, // List of aggregated measurements
    measurementsListTable: { count: 0, results: [] } // List of measurements for the table
}));