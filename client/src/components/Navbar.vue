<script setup>
import GlobalStore from '@/stores/global.js';
import { logout } from '@/utils/utils.js';

// Handle logout
const handleLogoutPress = () => {
	logout(); // Excecute logout
};

// Only if mobile
if (window.innerWidth < 992) {
	document.addEventListener('click', function(event) { // Close the mobile navbar when clicking outside
		let navbarToggle = document.querySelector('.navbar-toggler');
		let navbarMenu = document.querySelector('.navbar-collapse');
		const clickInsideNavbar = navbarMenu.contains(event.target) || navbarToggle.contains(event.target);
		if ((!clickInsideNavbar || event.target.classList.contains('close-navbar')) && navbarMenu.classList.contains('show')) navbarToggle.click(); // Emulate the click event to close the navbar
	});
}
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
						<router-link to="/" class="nav-link close-navbar" active-class="active">Measurements</router-link>
					</li>
					<li class="nav-item">
						<router-link to="/charts" class="nav-link close-navbar" active-class="active">Charts</router-link>
					</li>
					<li class="nav-item">
						<router-link to="/forecasts" class="nav-link close-navbar" active-class="active">Forecasts</router-link>
					</li>
				</ul>

				<!-- Login/Logout -->
				<ul class="navbar-nav mb-2 mb-lg-0">
					<li class="nav-item" v-if="!GlobalStore.adminToken">
						<router-link to="/login"><button type="button" class="btn btn-primary close-navbar d-flex justify-content-center align-items-center"><i class="fa-solid fa-right-to-bracket me-2"></i>LOGIN</button></router-link>
					</li>
					<li class="nav-item" v-if="GlobalStore.adminToken">
						<button type="button" class="btn btn-primary close-navbar d-flex justify-content-center align-items-center" @click="handleLogoutPress()"><i class="fa-solid fa-right-from-bracket me-2"></i>LOGOUT</button>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</template>