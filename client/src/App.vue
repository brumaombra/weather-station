<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { setBusy } from './utils/utils.js';
import { validateToken } from '@/utils/webRequests.js';
import MessageDialog from '@/components/MessageDialog.vue';
import Busy from '@/components/Busy.vue';
import GlobalStore from '@/stores/global.js';

// Validate the session
const validateSession = async () => {
	try {
		setBusy(true); // Busy on
		await validateToken(); // Validate the session
		GlobalStore.loggedIn = true; // Set logged in
		setBusy(false); // Busy off
	} catch (error) {
		setBusy(false); // Busy off
		GlobalStore.loggedIn = false; // Set logged out
	}
};

// On component mounted
onMounted(async () => {
	await validateSession();
});
</script>

<template>
	<!-- Main container -->
	<div>
		<RouterView />
	</div>

	<!-- Generic message modal -->
	<MessageDialog />

	<!-- Busy -->
	<Busy />
</template>