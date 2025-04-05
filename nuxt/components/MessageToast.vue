<script setup>
// Props
const props = defineProps({
    visible: { type: Boolean, default: false },
    type: { type: String, default: 'error' },
    message: { type: String, default: 'An error occurred' }
});

// Emits
const emit = defineEmits(['update:visible']);

// Handle dismiss toast
const handleDismissToastPress = () => {
    emit('update:visible', false);
};
</script>

<template>
    <div class="toast align-items-center bottom-0 end-0 mb-4 me-4 position-absolute show" role="alert" aria-live="assertive" aria-atomic="true" v-if="props.visible">
        <div class="d-flex">
            <div class="toast-body d-flex">
                <i class="fa-solid fa-circle-check success-icon fs-3 me-2" v-if="props.type === 'success'"></i>
                <i class="fa-solid fa-circle-exclamation error-icon fs-3 me-2" v-if="props.type === 'error'"></i>
                <p>{{ props.message }}</p>
            </div>
            <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" @click="handleDismissToastPress"></button>
        </div>
    </div>
</template>

<style scoped>
/* Toast */
.toast {
    border: 2px solid #dfe4ea;
    box-shadow: none;
    border-radius: 15px;
    padding-left: 8px;
    padding-right: 8px;
    padding-bottom: 3px;
    padding-top: 3px;
}

.toast .success-green-tick-toast {
    width: 25px;
    margin-right: 10px;
}

.toast-body p {
    font-weight: 500;
    align-self: center;
    margin-bottom: 0;
}

/* Icone */
.success-icon {
    color: #198754;
}

.error-icon {
    color: #dc3545;
}
</style>