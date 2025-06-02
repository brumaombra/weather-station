import { getKnex, logQuery, executeQueryWithReconnection } from '~/server/db/connection.js';
import { dateIsYesterday, getPercentageDifference } from '~/server/utils/utils.js';

const knex = getKnex();

// Get measurements with count
export const getMeasurements = async params => {
    try {
        if (!params) params = {};

        // Results query
        const resultsQuery = knex(`measurements`).select('*').orderBy(params.orderField || 'timestamp', params.orderDirection || 'desc');
        if (params.limit) resultsQuery.limit(params.limit);
        if (params.offset) resultsQuery.offset(params.offset);
        if (params.startDate) resultsQuery.where('timestamp', '>=', new Date(params.startDate));
        if (params.endDate) resultsQuery.where('timestamp', '<=', new Date(params.endDate));
        if (params.measurementType === 'ano') resultsQuery.where('temperatureAnomaly', true).orWhere('humidityAnomaly', true).orWhere('pressureAnomaly', true).orWhere('gasAnomaly', true).orWhere('pm1Anomaly', true).orWhere('pm25Anomaly', true).orWhere('pm10Anomaly', true);
        if (params.measurementType === 'nor') resultsQuery.where('temperatureAnomaly', false).where('humidityAnomaly', false).where('pressureAnomaly', false).where('gasAnomaly', false).where('pm1Anomaly', false).where('pm25Anomaly', false).where('pm10Anomaly', false);
        logQuery(resultsQuery);

        // Count query
        const countQuery = knex(`measurements`).count('id as count').first();
        if (params.startDate) countQuery.where('timestamp', '>=', new Date(params.startDate));
        if (params.endDate) countQuery.where('timestamp', '<=', new Date(params.endDate));
        if (params.measurementType === 'ano') countQuery.where('temperatureAnomaly', true).orWhere('humidityAnomaly', true).orWhere('pressureAnomaly', true).orWhere('gasAnomaly', true).orWhere('pm1Anomaly', true).orWhere('pm25Anomaly', true).orWhere('pm10Anomaly', true);
        if (params.measurementType === 'nor') countQuery.where('temperatureAnomaly', false).where('humidityAnomaly', false).where('pressureAnomaly', false).where('gasAnomaly', false).where('pm1Anomaly', false).where('pm25Anomaly', false).where('pm10Anomaly', false);
        logQuery(countQuery);

        // Execute the queries in parallel
        const [results, count] = await Promise.all([
            executeQueryWithReconnection(resultsQuery),
            executeQueryWithReconnection(countQuery)
        ]);

        // Return the results
        return { count: count.count, results };
    } catch (error) {
        const newError = new Error('Error while reading the measurements', { cause: error });
        console.error(newError);
        throw newError;
    }
};

// Get aggregated daily measurements
export const getAggregatedDailyMeasurements = async params => {
    try {
        // Get the right query
        const startDate = new Date(params.startDate); // Get the start date
        const isYesterday = dateIsYesterday(startDate);

        // Use the standard or aggregated query based on the date
        let query = null;
        if (isYesterday) {
            query = knex(`measurements`).select('timestamp as date')
                .select('temperature as temperatureAvg').select('temperature as temperatureMin').select('temperature as temperatureMax')
                .select('humidity as humidityAvg').select('humidity as humidityMin').select('humidity as humidityMax')
                .select('pressure as pressureAvg').select('pressure as pressureMin').select('pressure as pressureMax')
                .select('gas as gasAvg').select('gas as gasMin').select('gas as gasMax')
                .select('pm1 as pm1Avg').select('pm1 as pm1Min').select('pm1 as pm1Max')
                .select('pm25 as pm25Avg').select('pm25 as pm25Min').select('pm25 as pm25Max')
                .select('pm10 as pm10Avg').select('pm10 as pm10Min').select('pm10 as pm10Max')
                .orderBy('date', 'asc');
            if (params.startDate) query.whereRaw('timestamp >= ?', [new Date(params.startDate)]);
            if (params.endDate) query.whereRaw('timestamp <= ?', [new Date(params.endDate)]);
        } else {
            query = knex(`measurements`)
                .select(knex.raw('DATE(timestamp) as date'))
                .avg('temperature as temperatureAvg').min('temperature as temperatureMin').max('temperature as temperatureMax')
                .avg('humidity as humidityAvg').min('humidity as humidityMin').max('humidity as humidityMax')
                .avg('pressure as pressureAvg').min('pressure as pressureMin').max('pressure as pressureMax')
                .avg('gas as gasAvg').min('gas as gasMin').max('gas as gasMax')
                .avg('pm1 as pm1Avg').min('pm1 as pm1Min').max('pm1 as pm1Max')
                .avg('pm25 as pm25Avg').min('pm25 as pm25Min').max('pm25 as pm25Max')
                .avg('pm10 as pm10Avg').min('pm10 as pm10Min').max('pm10 as pm10Max')
                .groupByRaw('DATE(timestamp)')
                .orderBy('date', 'asc');
            if (params.startDate) query.whereRaw('timestamp >= ?', [new Date(params.startDate)]);
            if (params.endDate) query.whereRaw('timestamp <= ?', [new Date(params.endDate)]);
        }

        // Log the query
        logQuery(query);

        // Execute the query
        const results = await executeQueryWithReconnection(query);
        return { count: results.length, results };
    } catch (error) {
        const newError = new Error('Error while reading the measurements', { cause: error });
        console.error(newError);
        throw newError;
    }
};

// Get last measurement with comparison
export const getLastMeasurement = async () => {
    try {
        const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        // Last measurement and last week measurement queries
        const lastMeasurementQuery = knex(`measurements`).select('*').orderBy('timestamp', 'desc').first();
        const lastWeekMeasurementQuery = knex(`measurements`).select('*').where('timestamp', '<=', lastWeek).orderBy('timestamp', 'desc').first();

        // Execute the queries in parallel
        const [lastMeasurement, lastWeekMeasurement] = await Promise.all([
            executeQueryWithReconnection(lastMeasurementQuery),
            executeQueryWithReconnection(lastWeekMeasurementQuery)
        ]);

        // Calculate the percentage difference
        const percentageDifference = {
            temperature: getPercentageDifference(lastWeekMeasurement?.temperature, lastMeasurement?.temperature) || 0,
            humidity: getPercentageDifference(lastWeekMeasurement?.humidity, lastMeasurement?.humidity) || 0,
            pressure: getPercentageDifference(lastWeekMeasurement?.pressure, lastMeasurement?.pressure) || 0,
            gas: getPercentageDifference(lastWeekMeasurement?.gas, lastMeasurement?.gas) || 0,
            pm1: getPercentageDifference(lastWeekMeasurement?.pm1, lastMeasurement?.pm1) || 0,
            pm25: getPercentageDifference(lastWeekMeasurement?.pm25, lastMeasurement?.pm25) || 0,
            pm10: getPercentageDifference(lastWeekMeasurement?.pm10, lastMeasurement?.pm10) || 0
        };

        // Return the results
        return { ...lastMeasurement, lastWeek: { ...lastWeekMeasurement }, percentages: percentageDifference };
    } catch (error) {
        const newError = new Error('Error while reading the measurement', { cause: error });
        console.error(newError);
        throw newError;
    }
};

// Update measurement
export const updateMeasurement = async (id, newData) => {
    try {
        // Parameters validation
        if (!id) {
            throw new Error('Invalid parameters');
        }

        // Create the query
        const query = knex(`measurements`).where({ id }).update(newData);
        logQuery(query);

        // Execute the query
        return await executeQueryWithReconnection(query);
    } catch (error) {
        const newError = new Error('Error while updating the measurement', { cause: error });
        console.error(newError);
        throw newError;
    }
};

// Delete measurements
export const deleteMeasurements = async idList => {
    try {
        // Parameters validation
        if (!idList || !Array.isArray(idList) || idList.length === 0) {
            throw new Error('Invalid parameters');
        }

        // Create the query
        const query = knex(`measurements`).whereIn('id', idList).delete();
        logQuery(query);

        // Execute the query
        return await executeQueryWithReconnection(query);
    } catch (error) {
        const newError = new Error('Error while deleting the measurements', { cause: error });
        console.error(newError);
        throw newError;
    }
};

// Add measurement
export const addMeasurement = async measurement => {
    try {
        // Parameters validation
        if (!measurement) {
            throw new Error('Invalid parameters');
        }

        // Create the query
        const query = knex(`measurements`).insert(measurement);
        logQuery(query);

        // Execute the query
        return await executeQueryWithReconnection(query);
    } catch (error) {
        const newError = new Error('Error while adding the measurement', { cause: error });
        console.error(newError);
        throw newError;
    }
};