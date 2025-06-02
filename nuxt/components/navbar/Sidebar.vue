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
            <div v-if="isOpen" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm lg:hidden z-30" @click="emit('close')"></div>
        </Transition>

        <!-- Sidebar -->
        <aside class="fixed left-0 top-0 z-40 h-screen w-64 transition-transform duration-300 ease-in-out" :class="[isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']">
            <div class="h-full overflow-y-auto bg-white border-r border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
                <!-- Logo Section -->
                <div class="flex items-center justify-between h-16 px-6">
                    <div class="flex items-center space-x-2">
                        <i class="fa-solid fa-cloud-sun-rain text-2xl text-blue-600"></i>
                        <span class="text-xl font-bold dark:text-neutral-200">Weather Station</span>
                    </div>
                </div>

                <!-- Navigation Menu -->
                <nav class="px-3 py-4">
                    <ul class="space-y-1">
                        <li v-for="item in navigationItems" :key="item.path">
                            <NuxtLink :to="item.path" class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200" :class="[$route.path === item.path ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400' : 'text-gray-700 hover:bg-gray-50 dark:text-neutral-300 dark:hover:bg-neutral-800/50']">
                                <i :class="['text-base', item.icon]"></i>
                                <span>{{ item.label }}</span>
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