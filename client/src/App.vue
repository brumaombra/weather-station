<script setup>
import { RouterView } from 'vue-router';
import { setBusy, validateSession } from './utils/utils';
import MessageDialog from '@/components/MessageDialog.vue';
import Busy from '@/components/Busy.vue';

// Load the token from local storage
const getToken = () => {
	const token = localStorage.getItem('adminToken');
	if (!token) return; // If no token, exit
	setBusy(true); // Busy on
	try { // try to get the data
		const result = validateSession(); // Validate the session
		setBusy(false); // Busy off
	} catch(error) {
		setBusy(false); // Busy off
        const newError = new Error('Error while authenticating the user', { cause: error }); // Save the old error to the stack
        console.log(newError.message); // Log the error
        throw newError; // Throw the error
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

	<!-- Message toast
	<MessageToast /> -->

	<!-- Busy -->
	<Busy />
</template>