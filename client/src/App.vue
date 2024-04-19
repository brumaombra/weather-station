<script setup>
import { RouterView } from 'vue-router';
import { setBusy, validateSession } from './utils/utils';
import Navbar from '@/components/Navbar.vue';
import Busy from '@/components/Busy.vue';
import MessageToast from '@/components/MessageToast.vue';

// Load the token from local storage
const getToken = () => {
	const token = localStorage.getItem('adminToken');
	if (!token) return; // If no token, exit
	setBusy(true); // Busy on
	validateSession(data => { // Validate the session token
		setBusy(false); // Busy off
	}, error => {
		setBusy(false); // Busy off
	});
};

getToken(); // get the token

</script>

<template>
	<!-- Navbar -->
	<Navbar />

	<!-- Main container -->
	<div class="container mt-5">
		<RouterView />
	</div>

	<!-- Message toast -->
	<MessageToast />

	<!-- Busy -->
	<Busy />
</template>