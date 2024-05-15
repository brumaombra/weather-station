import { createRouter, createWebHistory } from 'vue-router'
import Measurements from '@/views/Measurements.vue';
import Charts from '@/views/Charts.vue';
import Forecasts from '@/views/Forecasts.vue';
import Correlations from '@/views/Correlations.vue';
import Login from '@/views/Login.vue';
import NotFound from '@/views/NotFound.vue';
import Dashboard from '@/views/dashboard/Dashboard.vue';

// Router
const router = createRouter({
    history: createWebHistory('/'),
    routes: [{
        path: '/',
        name: 'measurements',
        component: Measurements
    }, {
        path: '/charts',
        name: 'charts',
        component: Charts
    }, {
        path: '/correlations',
        name: 'correlations',
        component: Correlations
    }, {
        path: '/forecasts',
        name: 'forecasts',
        component: Forecasts
    }, {
        path: '/login',
        name: 'login',
        component: Login
    }, {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        children: [{
            path: 'measurements',
            name: 'measurements',
            component: Measurements
        }, {
            path: 'charts',
            name: 'charts',
            component: Charts
        }, {
            path: 'correlations',
            name: 'correlations',
            component: Correlations
        }]
    }, {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        component: NotFound
    }]
});

// Setup preline
router.afterEach((to, from, failure) => {
    if (!failure) {
        setTimeout(() => {
            window.HSStaticMethods.autoInit();
        }, 100);
    }
});

export default router;