import { createRouter } from 'vue-router';
import { createWebHistory } from 'vue-router';
import Measurements from '@/views/Measurements.vue';
import Charts from '@/views/Charts.vue';
import Forecasts from '@/views/Forecasts.vue';
import Login from '@/views/Login.vue';

export default createRouter({
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
        path: '/forecasts',
        name: 'forecasts',
        component: Forecasts
    }, {
        path: '/login',
        name: 'login',
        component: Login
    }]
});