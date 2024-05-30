<script setup>
import { reactive } from 'vue';
import { setBusy, showMessageDialog, loginAttempt } from '@/utils/utils.js';

// View model
const viewModel = reactive({
    username: '',
    password: '',
    rememberMe: false
});

// Handle login button press
const handleLoginPress = async () => {
    const username = viewModel.username;
    const password = viewModel.password;
    if (!username || !password) return; // If no username or password, exit
    try { // Try to log in
        setBusy(true); // Busy on
        const result = await loginAttempt(username, password, viewModel.rememberMe);
        setBusy(false); // Busy off
        window.location.href = '/'; // Redirect
    } catch(error) {
        setBusy(false); // Busy off
        const newError = new Error('Error while logging in', { cause: error }); // Save the old error to the stack
        showMessageDialog(newError.message, 'error'); // Show toast
        throw newError; // Throw the error
    }
};
</script>

<template>
    <div class="bg-gray-100 dark:bg-neutral-800">
        <!-- Header -->
        <header class="mb-auto flex justify-center z-50 w-full absolute top-5">
            <div class="flex items-center justify-center text-3xl font-bold text-gray-600">
                Weather Station<i class="fa-solid fa-cloud-sun-rain ms-2 fs-4 text-blue-600"></i>
            </div>
        </header>

        <div class="w-full max-w-md mx-auto">
            <div class="flex items-center min-h-screen">
                <!-- Card -->
                <div class="w-full">
                    <div class="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700 w-full">
                        <div class="p-4 sm:p-7">
                            <!-- Title -->
                            <div class="text-center">
                                <h1 class="block text-2xl font-bold text-gray-800 dark:text-white"><i class="fa-solid fa-right-to-bracket me-3"></i>Login</h1>
                                <p class="mt-2 text-sm text-gray-600 dark:text-neutral-400">Login to get the full functionalities</p>
                            </div>

                            <!-- Form -->
                            <div class="mt-5">
                                <div>
                                    <div class="grid gap-y-4">
                                        <!-- Username -->
                                        <div>
                                            <label class="block text-sm mb-2 dark:text-white">Username</label>
                                            <input type="text" v-model="viewModel.username" class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" required>
                                        </div>

                                        <!-- Password -->
                                        <div>
                                            <label class="block text-sm mb-2 dark:text-white">Username</label>
                                            <input type="password" v-model="viewModel.password" class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" required>
                                        </div>
                                        
                                        <!-- Checkbox -->
                                        <div class="flex items-center">
                                            <div class="flex">
                                                <input type="checkbox" v-model="viewModel.rememberMe" class="shrink-0 mt-0.5 cursor-pointer border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800">
                                            </div>
                                            <div class="ms-3">
                                                <label class="text-sm dark:text-white">Remember me</label>
                                            </div>
                                        </div>

                                        <!-- Login button -->
                                        <button @click="handleLoginPress" class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-extrabold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">Login</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Back button -->
                    <div class="flex items-center justify-center mt-4">
                        <router-link to="/">
                            <button>
                                <i class="fa-solid fa-arrow-left me-2"></i>Back to home
                            </button>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>