import { createRouter } from 'vue-router';
import { createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Measurements from '@/views/Measurements.vue';
import Charts from '@/views/Charts.vue';
import Forecasts from '@/views/Forecasts.vue';
import Correlations from '@/views/Correlations.vue';
import Login from '@/views/Login.vue';
import NotFound from '@/views/NotFound.vue';

export default createRouter({
    history: createWebHistory('/'),
    routes: [{
        path: '/',
        name: 'home',
        component: Home
    }, {
        path: '/measurements',
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
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        component: NotFound
    }]
});