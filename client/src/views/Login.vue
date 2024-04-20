<script setup>
import { reactive } from 'vue';
import { setBusy, showToast, loginAttempt } from '@/utils/utils.js';

// View model
const viewModel = reactive({
    username: '',
    password: ''
});

// Handle login button press
const handleLoginPress = () => {
    const username = viewModel.username;
    const password = viewModel.password;
    if (!username || !password) return; // If no username or password, exit

    // Try to login
    setBusy(true); // Busy on
    loginAttempt(username, password, data => {
        setBusy(false); // Busy off
        window.location.href = '/'; // Redirect
    }, error => {
        setBusy(false); // Busy off
        showToast(error.message || 'Error while logging in', 'error');
    });
};
</script>

<template>
    <div class="mt-6 login-container">
        <div class="mb-4">
            <h2>Login</h2>
        </div>
        <div class="mb-3">
            <label class="form-label">Username</label>
            <input type="text" class="form-control" v-model="viewModel.username" @keyup.enter="handleLoginPress()" />
        </div>
        <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" v-model="viewModel.password" @keyup.enter="handleLoginPress()" />
        </div>
        <div class="mb-3">
            <button type="button" class="btn btn-primary" :disabled="!viewModel.username || !viewModel.password" @click="handleLoginPress()"><i class="fa-solid fa-right-to-bracket me-2"></i>LOGIN</button>
        </div>
    </div>
</template>

<style scoped>
/* Login container */
.login-container {
    max-width: 350px;
    margin: auto;
}
</style>