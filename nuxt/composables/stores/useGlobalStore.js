export const useGlobalStore = () => useState('global', () => ({
    busy: false, // Global busy state
    user: null, // User data
    toast: { // Message toast data
        visible: false,
        message: '',
        type: 'success'
    }, dialog: { // Message dialog data
        visible: false,
        message: '',
        type: 'success'
    }
}));