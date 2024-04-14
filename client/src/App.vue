<script setup>
import { RouterView } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import Busy from '@/components/Busy.vue'
import MessageToast from '@/components/MessageToast.vue'
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