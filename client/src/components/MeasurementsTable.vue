<script setup>
import GlobalStore from '@/stores/store';



</script>

<template>
    <!-- Table -->
    <table class="table table-striped">
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Timestamp</th>
                <th scope="col">Temperature</th>
                <th scope="col">Humidity</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in GlobalStore.measurementsList">
                <th scope="row">{{ item.id }}</th>
                <td>{{ item.timestamp }}</td>
                <td>{{ item.temperature }}</td>
                <td>{{ item.humidity }}</td>
            </tr>
        </tbody>
    </table>
</template>