<script setup>
import { RouterView } from 'vue-router';
import { setBusy } from './utils/utils.js';
import { validateSession } from '@/utils/webRequests.js';
import MessageDialog from '@/components/MessageDialog.vue';
import Busy from '@/components/Busy.vue';

// Load the token from local storage
const getToken = async () => {
	const token = localStorage.getItem('adminToken');
	if (!token) return; // If no token, exit
	setBusy(true); // Busy on
	try { // try to get the data
		await validateSession(); // Validate the session
		setBusy(false); // Busy off
	} catch (error) {
		setBusy(false); // Busy off
	}
};

getToken(); // get the token

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