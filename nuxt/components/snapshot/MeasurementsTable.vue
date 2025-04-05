<script setup>
import { formatUnitNumber, formatTimestamp } from '~/utils/formatter.js';

// Props
const props = defineProps({
    measurementsList: { type: Object, default: {} }
});
</script>

<template>
    <!-- Table card -->
    <div class="flex flex-col">
        <div class="-m-1.5 overflow-x-auto">
            <div class="p-1.5 min-w-full inline-block align-middle">
                <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-500">
                    <!-- Header -->
                    <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200">
                        <!-- Title -->
                        <div class="flex items-center">
                            <div class="mr-5">
                                <i class="fa-solid fa-table text-xl dark:text-neutral-200"></i>
                            </div>
                            <div>
                                <h2 class="text-xl font-bold text-gray-800 dark:text-neutral-200">Last measurements</h2>
                                <p class="text-sm text-gray-600 dark:text-neutral-200">The last measurements taken by the station</p>
                            </div>
                        </div>
                    </div>

                    <!-- Table -->
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50 dark:bg-neutral-800">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">ID</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">Timestamp</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">Temperature</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">Humidity</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">Pressure</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">Gas</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">PM1</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">PM2.5</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">PM10</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr v-for="item in props.measurementsList?.results">
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ item.id }}</span>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <span class="text-sm text-gray-500 dark:text-neutral-200">{{ formatTimestamp(item.timestamp) }}</span>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <div v-if="!item.temperatureAnomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.temperature, 1) }} <span class="font-thin text-xs">°C</span></span>
                                        </div>
                                        <div v-if="item.temperatureAnomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.temperature, 1) }} <span class="font-thin text-xs">°C</span></span>
                                            <i class="fa-solid fa-triangle-exclamation text-red-500 dark:text-red-400 ms-2" title="Anomalous value, 2 standard deviations from the norm"></i>
                                        </div>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <div v-if="!item.humidityAnomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.humidity, 1) }} <span class="font-thin text-xs">%</span></span>
                                        </div>
                                        <div v-if="item.humidityAnomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.humidity, 1) }} <span class="font-thin text-xs">%</span></span>
                                            <i class="fa-solid fa-triangle-exclamation text-red-500 dark:text-red-400 ms-2" title="Anomalous value, 2 standard deviations from the norm"></i>
                                        </div>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <div v-if="!item.pressureAnomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.pressure, 1) }} <span class="font-thin text-xs">hPa</span></span>
                                        </div>
                                        <div v-if="item.pressureAnomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.pressure, 1) }} <span class="font-thin text-xs">hPa</span></span>
                                            <i class="fa-solid fa-triangle-exclamation text-red-500 dark:text-red-400 ms-2" title="Anomalous value, 2 standard deviations from the norm"></i>
                                        </div>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <div v-if="!item.gasAnomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.gas, 1) }} <span class="font-thin text-xs">kOhm</span></span>
                                        </div>
                                        <div v-if="item.gasAnomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.gas, 1) }} <span class="font-thin text-xs">kOhm</span></span>
                                            <i class="fa-solid fa-triangle-exclamation text-red-500 dark:text-red-400 ms-2" title="Anomalous value, 2 standard deviations from the norm"></i>
                                        </div>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <div v-if="!item.pm1Anomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.pm1, 0) }} <span class="font-thin text-xs">µg/m³</span></span>
                                        </div>
                                        <div v-if="item.pm1Anomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.pm1, 0) }} <span class="font-thin text-xs">µg/m³</span></span>
                                            <i class="fa-solid fa-triangle-exclamation text-red-500 dark:text-red-400 ms-2" title="Anomalous value, 2 standard deviations from the norm"></i>
                                        </div>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <div v-if="!item.pm25Anomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.pm25, 0) }} <span class="font-thin text-xs">µg/m³</span></span>
                                        </div>
                                        <div v-if="item.pm25Anomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.pm25, 0) }} <span class="font-thin text-xs">µg/m³</span></span>
                                            <i class="fa-solid fa-triangle-exclamation text-red-500 dark:text-red-400 ms-2" title="Anomalous value, 2 standard deviations from the norm"></i>
                                        </div>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <div v-if="!item.pm10Anomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.pm10, 0) }} <span class="font-thin text-xs">µg/m³</span></span>
                                        </div>
                                        <div v-if="item.pm10Anomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.pm10, 0) }} <span class="font-thin text-xs">µg/m³</span></span>
                                            <i class="fa-solid fa-triangle-exclamation text-red-500 dark:text-red-400 ms-2" title="Anomalous value, 2 standard deviations from the norm"></i>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Footer -->
                    <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-neutral-200">
                                <span class="font-bold text-gray-800 dark:text-neutral-200">{{ props.measurementsList?.count }}</span> results
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>