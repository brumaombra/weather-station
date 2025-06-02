<script setup>
import { useRoute } from 'vue-router';

// Props
const props = defineProps({
    isOpen: { type: Boolean, required: true }
});

// Emits
const emit = defineEmits(['close']);

// Routes list
const navigationItems = [{
    path: '/',
    label: 'Snapshot',
    icon: 'fa-solid fa-camera'
}, {
    path: '/measurements',
    label: 'Measurements',
    icon: 'fa-solid fa-table'
}, {
    path: '/charts',
    label: 'Charts',
    icon: 'fa-solid fa-chart-line'
}, {
    path: '/correlations',
    label: 'Correlations',
    icon: 'fa-solid fa-magnifying-glass-chart'
}];

// Close sidebar on route change on mobile
watch(() => useRoute().path, () => {
    if (window.innerWidth < 1024) {
        emit('close');
    }
});
</script>

<template>
    <div>
        <!-- Backdrop -->
        <Transition name="fade">
            <div v-if="isOpen" class="fixed inset-0 bg-gray-700/60 backdrop-blur-sm lg:hidden z-35" @click="emit('close')"></div>
        </Transition>

        <!-- Sidebar -->
        <aside class="fixed left-0 top-0 z-40 h-screen w-64 transition-transform duration-300 ease-in-out" :class="[isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']">
            <div class="h-full overflow-y-auto bg-white border-r border-gray-100 shadow-xl dark:from-neutral-900 dark:to-neutral-950/50 dark:border-neutral-800">
                <!-- Logo Section -->
                <div class="flex items-center justify-between h-20 px-6 border-b border-gray-100 dark:border-neutral-800">
                    <div class="flex items-center space-x-3">
                        <div class="relative">
                            <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-20"></div>
                            <div class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                                <i class="fa-solid fa-cloud-sun-rain text-lg text-white"></i>
                            </div>
                        </div>
                        <span class="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">Weather Station</span>
                    </div>
                </div>

                <!-- Navigation Menu -->
                <nav class="px-4 py-6">
                    <ul class="space-y-2">
                        <li v-for="item in navigationItems" :key="item.path">
                            <NuxtLink :to="item.path" class="flex items-center gap-4 px-4 py-4 text-sm font-semibold rounded-xl transition-all duration-200 group" :class="[$route.path === item.path ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25' : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 dark:text-neutral-300 dark:hover:from-neutral-800 dark:hover:to-neutral-700 dark:hover:text-white']">
                                <div class="relative">
                                    <i :class="['text-lg transition-transform duration-200 group-hover:scale-110', item.icon, $route.path === item.path ? 'text-white' : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent']"></i>
                                </div>
                                <span class="font-medium">{{ item.label }}</span>
                            </NuxtLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>