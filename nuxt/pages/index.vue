<script setup>
import { onMounted } from 'vue';

// On component mounted
onMounted(() => {
    navigateTo("/dashboard"); // Redirect to snapshot
});
</script>

<template>
    <NuxtLayout>
        <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 class="text-4xl font-bold text-gray-800">Welcome to the Dashboard</h1>
            <p class="mt-4 text-lg text-gray-600">Redirecting to the dashboard...</p>
        </div>
    </NuxtLayout>
</template>