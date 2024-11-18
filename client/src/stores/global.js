import { reactive } from 'vue';

export default reactive({
    // adminToken: "", // Admin token
    loggedIn: false, // Logged in state
    busy: false, // Global busy state
    toast: { // Message toast data
        visible: false,
        message: '',
        type: 'success'
    }, dialog: { // Message dialog data
        message: '',
        type: 'success'
    }
});