<script setup>
import GlobalStore from '@/stores/global.js';
import { logout } from '@/utils/webRequests.js';

// Handle logout
const handleLogoutPress = () => {
	logout(); // Excecute logout
};
</script>

<template>
    <div class="hs-dropdown [--placement:bottom-right] relative inline-flex">
        <!-- Avatar -->
        <button type="button" class="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">
            <img class="inline-block size-[38px] rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80" alt="Image Description">
        </button>

        <!-- Dropdown (Logged in) -->
        <div v-if="GlobalStore.adminToken" class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2">
            <div class="py-3 px-5 -m-2 bg-gray-100 rounded-t-lg">
                <p class="text-sm text-gray-500">Signed in as</p>
                <p class="text-sm font-medium text-gray-800">james@site.com</p>
            </div>
            <div class="mt-2 py-2 first:pt-0 last:pb-0">
                <a @click="handleLogoutPress()" class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 cursor-pointer">
                    <i class="fa-solid fa-right-from-bracket"></i>Logout
                </a>
            </div>
        </div>

        <!-- Dropdown (Not logged in) -->
        <div v-if="!GlobalStore.adminToken" class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2">
            <div class="py-2 first:pt-0 last:pb-0">                    
                <router-link to="/login" class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 cursor-pointer">
                    <i class="fa-solid fa-right-to-bracket"></i>Login
                </router-link>
            </div>
        </div>
    </div>
</template>