<script setup>
import GlobalStore from '@/stores/global.js';
</script>

<template>
    <div class="fullscreen-loader" v-if="GlobalStore.busy">
        <div class="spinner-container">
            <div class="animate-spin inline-block size-10 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .fullscreen-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.7);
        z-index: 9999;
    }

    .fullscreen-loader .spinner-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: #0984E3;
    }

    .fullscreen-loader .spinner-container .spinner-border {
        width: 3rem;
        height: 3rem;
    }
</style>