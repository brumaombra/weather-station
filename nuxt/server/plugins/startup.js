import { initMySqlDatabase } from '~/server/db/connection.js';

// Init function
export default defineNitroPlugin(async () => {
    if (process.env.BUILDTIME === 'true') {
        console.log('In build mode, skipping server initialization');
        return; // Skip initialization if it's build time
    }

    // Start the server
    console.log('Server started!');
    await initServices();
});

// Initialize the services
const initServices = async () => {
    try {
        await initMySqlDatabase(); // Initialize the MySQL database
    } catch (error) {
        console.error('Error initializing services:', error);
        throw error;
    }
};