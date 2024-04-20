<script setup>
import GlobalStore from '@/stores/store.js';
import { logout } from '@/utils/utils.js';

// Handle logout
const handleLogoutPress = () => {
	logout(); // Excecute logout
};
</script>

<template>
    <nav class="navbar navbar-expand-lg sticky-top bg-body-tertiary">
		<div class="container">
			<div>
				<i class="fa-solid fa-cloud-sun-rain me-2 fs-4 text-primary"></i>
				<a class="navbar-brand fw-bold" href="#">Weather Station</a>
			</div>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div id="navbarSupportedContent" class="collapse navbar-collapse">
				<!-- Views -->
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<li class="nav-item">
						<router-link to="/" class="nav-link" active-class="active">Measurements</router-link>
					</li>
					<li class="nav-item">
						<router-link to="/charts" class="nav-link" active-class="active">Charts</router-link>
					</li>
					<li class="nav-item">
						<router-link to="/forecasts" class="nav-link" active-class="active">Forecasts</router-link>
					</li>
				</ul>

				<!-- Login/Logout -->
				<ul class="navbar-nav mb-2 mb-lg-0">
					<li class="nav-item" v-if="!GlobalStore.adminToken">
						<router-link to="/login" class="nav-link" active-class="active">Login</router-link>
					</li>
					<li class="nav-item" v-if="GlobalStore.adminToken">
						<button type="button" class="btn btn-primary" @click="handleLogoutPress()"><i class="fa-solid fa-right-from-bracket me-2"></i>LOGOUT</button>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</template>