<script setup>
import TemperatureLineChart from '@/components/TemperatureLineChart.vue';
import HumidityLineChart from '@/components/HumidityLineChart.vue';
</script>

<template>
    <!-- Toolbar -->
    <div class="d-flex mb-4-5 align-items-center justify-content-between">
        <h3 class="mb-0"><i class="fa-solid fa-chart-line me-3"></i>Charts</h3>
        <select id="settingsResolution" class="form-select w-auto">
            <option value="D" selected>Last day</option>
            <option value="W">Last week</option>
            <option value="M">Last month</option>
            <option value="Y">Last year</option>
        </select>
    </div>

    <!-- Container responsive -->
    <div class="row">
        <!-- Temperature chart -->
        <div class="col-6">
            <TemperatureLineChart />
        </div>

        <!-- Humidity chart -->
        <div class="col-6">
            <HumidityLineChart />
        </div>
    </div>
</template>