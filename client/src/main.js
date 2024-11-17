import { createApp } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import router from './router';
import App from './App.vue';
import 'preline/preline';
import './assets/main.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const app = createApp(App);
app.use(router);
app.use(VueApexCharts);
app.mount('#app');