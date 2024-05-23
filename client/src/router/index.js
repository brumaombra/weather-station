import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Dashboard from '@/views/dashboard/Dashboard.vue';
import Measurements from '@/views/dashboard/Measurements.vue';
import Charts from '@/views/dashboard/Charts.vue';
import Forecasts from '@/views/Forecasts.vue';
import Correlations from '@/views/Correlations.vue';
import NotFound from '@/views/NotFound.vue';

// Router
const router = createRouter({
    history: createWebHistory('/'),
    routes: [{
        path: '/',
        name: 'home',
        component: Home
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
        }, {
            path: 'forecasts',
            name: 'forecasts',
            component: Forecasts
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