import authRoutes from './auth.js';
import measurementsRoutes from './measurements.js';

export default app => {
    app.use('/auth', authRoutes);
    app.use('/api/measurements', measurementsRoutes);
};