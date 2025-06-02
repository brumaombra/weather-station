<script setup>
import Button from '~/components/ui/Button.vue';
import CustomModal from '~/components/CustomModal.vue';

// Props
const props = defineProps({
    visible: { type: Boolean, default: false },
    title: { type: String, default: "Confirm" },
    message: { type: String, default: "Confirm?" }
});

// Emits
const emits = defineEmits(['confirm', 'update:visible']);

// Handle close press
const handleClosePress = () => {
    emits('update:visible', false);
};

// Handle confirm press
const handleConfirmPress = () => {
    emits('confirm');
    emits('update:visible', false);
};
</script>

<template>
    <CustomModal :visible="props.visible" :title="props.title" icon="fa-solid fa-circle-question">
        <!-- Body -->
        <template #body>
            <p>{{ props.message }}</p>
        </template>

        <!-- Footer -->
        <template #footer>
            <Button type="secondary" text="Cancel" icon="fa-solid fa-times" @click="handleClosePress" />
            <Button type="primary" text="Confirm" icon="fa-solid fa-check" @click="handleConfirmPress" />
        </template>
    </CustomModal>
</template>