import { reactive } from 'vue';

export default reactive({
    adminToken: null, // Admin token
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