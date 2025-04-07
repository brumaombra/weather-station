<script setup>
import { onMounted, computed, ref } from 'vue';
import { setBusy, showMessageDialog } from '~/composables/useUtils.js';
import { emailPasswordLogin, getCurrentUser, googleLogin } from '~/composables/api/useFirebase.js';

const username = ref('');
const password = ref('');

// Validate form fields
const validateForm = computed(() => {
    return username.value?.trim() !== '' && password.value?.trim() !== '';
});

// Handle login button press
const handleLoginPress = async () => {
    try {
        setBusy(true);
        await emailPasswordLogin(username.value, password.value);
        navigateTo('/'); // Redirect after login
        setBusy(false);
    } catch (error) {
        setBusy(false);
        showMessageDialog(error.message || 'Error while logging in', 'error');

        // Reset form fields
        username.value = '';
        password.value = '';
    }
};

// Handle Google login button press
const handleGoogleLogin = async () => {
    try {
        setBusy(true);
        await googleLogin();
        navigateTo('/'); // Redirect after login
        setBusy(false);
    } catch (error) {
        setBusy(false);
        showMessageDialog(error.message || 'Error while logging in with Google', 'error');
    }
};

// On component mounted
onMounted(async () => {
    const user = await getCurrentUser(); // Get current user
    if (user) {
        navigateTo('/'); // Redirect to home if already logged in
    }
});
</script>

<template>
    <NuxtLayout>
        <div class="flex flex-col justify-center bg-white md:bg-gray-50 dark:bg-neutral-800 py-7 min-h-screen">
            <!-- Header -->
            <header>
                <div class="flex items-center justify-center text-3xl font-bold text-gray-600 dark:text-neutral-200">
                    Weather Station<i class="fa-solid fa-cloud-sun-rain ms-2 text-blue-600"></i>
                </div>
            </header>

            <!-- Card container -->
            <div class="w-full max-w-md mx-auto mt-9">
                <div>
                    <!-- Card -->
                    <div class="bg-white md:rounded-xl md:border md:border-gray-200 md:shadow-sm dark:bg-neutral-800 dark:border-none">
                        <div class="p-4 sm:p-7">
                            <!-- Title -->
                            <div class="text-center">
                                <h1 class="block text-2xl font-bold text-gray-800 dark:text-neutral-200"><i class="fa-solid fa-right-to-bracket me-3"></i>Login</h1>
                                <p class="mt-2 text-sm text-gray-600 dark:text-neutral-400">Login to get the full functionalities</p>
                            </div>

                            <!-- Form -->
                            <div class="mt-5">
                                <form @submit.prevent="handleLoginPress">
                                    <div class="grid gap-y-6">
                                        <!-- Username -->
                                        <div>
                                            <label class="block text-sm dark:text-neutral-200 mb-2">Email</label>
                                            <input type="text" v-model="username" class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-500 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" required>
                                        </div>

                                        <!-- Password -->
                                        <div>
                                            <label class="block text-sm dark:text-neutral-200 mb-2">Password</label>
                                            <input type="password" v-model="password" class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-500 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" required>
                                        </div>

                                        <!-- Login button -->
                                        <button type="submit" :disabled="!validateForm" class="mt-2 w-full py-3 px-4 inline-flex justify-center items-center cursor-pointer gap-x-2 text-sm font-extrabold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">Login</button>
                                    </div>
                                </form>

                                <!-- Google Login button -->
                                <div class="mt-4">
                                    <button @click="handleGoogleLogin" class="w-full py-3 px-4 inline-flex justify-center items-center cursor-pointer gap-x-2 text-sm font-extrabold rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 dark:bg-neutral-900 dark:border-neutral-500 dark:text-neutral-400 dark:hover:bg-neutral-800">
                                        <i class="fa-brands fa-google me-2"></i>Login with Google
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Back button -->
                    <div class="flex items-center justify-center mt-4 dark:text-neutral-200">
                        <NuxtLink to="/">
                            <button>
                                <i class="fa-solid fa-arrow-left me-2"></i>Back to home
                            </button>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>