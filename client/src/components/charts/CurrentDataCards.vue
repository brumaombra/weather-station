<script setup>
import ChartsStore from '@/stores/charts.js';
import { formatDecimal } from '@/utils/formatter.js';
</script>

<template>
    <!-- Responsive grid -->
    <div class="mt-4">
        <div class="row">
            <h5>Real-time data</h5>
            <!-- Temperature card -->
            <div class="col-lg-3 col-12 mt-3">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex align-items-center justify-content-between">
                            <i class="fa-solid fa-temperature-half text-danger measurementIcon"></i>
                            <h2 class="mb-0 measurementText">{{ formatDecimal(ChartsStore.lastMeasurement?.temperature, 1) }} <span class="measurementUnit">°C</span></h2>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Humidity card -->
            <div class="col-lg-3 col-12 mt-3">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex align-items-center justify-content-between">
                            <i class="fa-solid fa-droplet text-primary measurementIcon"></i>
                            <h2 class="mb-0 measurementText">{{ formatDecimal(ChartsStore.lastMeasurement?.humidity, 1) }} <span class="measurementUnit">%</span></h2>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pressure card -->
            <div class="col-lg-3 col-12 mt-3">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex align-items-center justify-content-between">
                            <i class="fa-solid fa-gauge-high text-warning measurementIcon"></i>
                            <h2 class="mb-0 measurementText">{{ formatDecimal(ChartsStore.lastMeasurement?.pressure, 0) }} <span class="measurementUnit">hPa</span></h2>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Gas card -->
            <div class="col-lg-3 col-12 mt-3">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex align-items-center justify-content-between">
                            <i class="fa-solid fa-smog text-info measurementIcon"></i>
                            <h2 class="mb-0 measurementText">{{ formatDecimal(ChartsStore.lastMeasurement?.gas, 0) }} <span class="measurementUnit">ppm</span></h2>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PM2.5 card -->
            <div class="col-lg-3 col-12 mt-3">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex align-items-center justify-content-between">
                            <i class="fa-solid fa-hill-rockslide text-success measurementIcon"></i>
                            <h2 class="mb-0 measurementText">{{ formatDecimal(ChartsStore.lastMeasurement?.pm25, 0) }} <span class="measurementUnit">µg/m³</span></h2>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PM10 card -->
            <div class="col-lg-3 col-12 mt-3">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex align-items-center justify-content-between">
                            <i class="fa-solid fa-hill-rockslide text-dark measurementIcon"></i>
                            <h2 class="mb-0 measurementText">{{ formatDecimal(ChartsStore.lastMeasurement?.pm10, 0) }} <span class="measurementUnit">µg/m³</span></h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .card {
        border-radius: 10px;
    }
    .card-body {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
    }
    .measurementIcon {
        font-size: 2.5rem;
    }
    .measurementText {
        font-size: 2rem;
    }
    .measurementUnit {
        font-size: 1.3rem;
        font-weight: 400;
    }
    
    /* Desktop */
    @media (min-width: 993px) {
        .measurementIcon {
            font-size: 2rem;
        }
    }
</style>