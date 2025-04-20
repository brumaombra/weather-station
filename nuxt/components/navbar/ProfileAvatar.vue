<script setup>
import { ref, onMounted } from 'vue';
import { useGlobalStore } from '~/composables/stores/useGlobalStore.js';
import { logout, getCurrentUser } from '~/composables/api/useFirebase.js';

const globalStore = useGlobalStore();
const isDropdownOpen = ref(false);

// Toggle dropdown visibility
const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

// Handle logout
const handleLogoutPress = async () => {
    try {
        await logout(); // Call logout API
        globalStore.value.user = null; // Clear user data
        isDropdownOpen.value = false; // Close dropdown
        window.location.href = '/'; // Redirect
    } catch (error) {
        showMessageDialog(error.message || 'Error while logging out', 'error'); // Show dialog
    }
};

// On component mounted
onMounted(async () => {
    // globalStore.value.user = await getCurrentUser(); // Get current user
});
</script>

<template>
    <div class="relative inline-flex">
        <!-- Avatar -->
        <button type="button" @click="toggleDropdown" class="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 cursor-pointer text-sm font-semibold rounded-full border border-transparent text-gray-800 bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">
            <i class="fa-solid fa-user text-gray-300"></i>
        </button>

        <!-- Dropdown -->
        <div v-if="isDropdownOpen">
            <!-- Logged in -->
            <div v-if="globalStore.user" class="absolute right-0 mt-12 min-w-60 bg-white shadow-md rounded-lg p-2 transition-opacity duration-200">
                <div class="py-3 px-5 -m-2 bg-gray-100 rounded-t-lg">
                    <p class="text-sm text-gray-500">Signed in as</p>
                    <p class="text-sm font-medium text-gray-800">{{ globalStore.user?.email }}</p>
                </div>
                <div class="mt-2 py-2 first:pt-0 last:pb-0">
                    <a @click="handleLogoutPress" class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 cursor-pointer">
                        <i class="fa-solid fa-right-from-bracket"></i>Logout
                    </a>
                </div>
            </div>

            <!-- Not logged in -->
            <div v-else class="absolute right-0 mt-12 min-w-60 bg-white shadow-md rounded-lg p-2 transition-opacity duration-200">
                <div class="py-2 first:pt-0 last:pb-0">
                    <NuxtLink to="/login" class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 cursor-pointer">
                        <i class="fa-solid fa-right-to-bracket"></i>Login
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>