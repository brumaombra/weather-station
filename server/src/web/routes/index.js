import authRoutes from './auth.js';
import measurementsRoutes from './measurements.js';
import chatbotRoutes from './chatbot.js';

export default app => {
    app.use('/auth', authRoutes);
    app.use('/api/measurements', measurementsRoutes);
    app.use('/api/chatbot', chatbotRoutes);
};