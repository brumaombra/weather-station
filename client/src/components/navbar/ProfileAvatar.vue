<script setup>
import { setBusy } from '@/utils/utils';
import { logout } from '@/utils/requests.js';
import { showMessageDialog } from '@/utils/utils.js';
import GlobalStore from '@/stores/global.js';

// Handle logout
const handleLogoutPress = async () => {
    try {
        setBusy(true); // Busy on
        await logout(); // Excecute logout
        GlobalStore.loggedIn = false; // Set logged out
        setBusy(false); // Busy off
        window.location.href = '/'; // Redirect
    } catch (error) {
        setBusy(false); // Busy off
        showMessageDialog(error.message || 'Error while logging out', 'error'); // Show dialog
    }
};
</script>

<template>
    <div class="hs-dropdown [--placement:bottom-right] relative inline-flex">
        <!-- Avatar -->
        <button type="button" class="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">
            <i class="fa-solid fa-user text-gray-300"></i>
        </button>

        <!-- Dropdown (Logged in) -->
        <div v-if="GlobalStore.loggedIn" class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2">
            <div class="py-3 px-5 -m-2 bg-gray-100 rounded-t-lg">
                <p class="text-sm text-gray-500">Signed in as</p>
                <p class="text-sm font-medium text-gray-800">james@site.com</p>
            </div>
            <div class="mt-2 py-2 first:pt-0 last:pb-0">
                <a @click="handleLogoutPress" class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 cursor-pointer">
                    <i class="fa-solid fa-right-from-bracket"></i>Logout
                </a>
            </div>
        </div>

        <!-- Dropdown (Not logged in) -->
        <div v-if="!GlobalStore.loggedIn" class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2">
            <div class="py-2 first:pt-0 last:pb-0">                    
                <router-link to="/login" class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 cursor-pointer">
                    <i class="fa-solid fa-right-to-bracket"></i>Login
                </router-link>
            </div>
        </div>
    </div>
</template>