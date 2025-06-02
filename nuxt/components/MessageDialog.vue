<script setup>
import CustomButton from '~/components/ui/CustomButton.vue';

// Props
const props = defineProps({
    visible: { type: Boolean, default: false },
    type: { type: String, default: 'error' },
    title: { type: String, default: 'Error' },
    message: { type: String, default: 'An error occurred' }
});

// Emits
const emit = defineEmits(['update:visible']);

// Handle close dialog
const handleCloseDialog = () => {
    emit('update:visible', false);
};
</script>

<template>
    <div class="size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto bg-gray-900/50" v-if="props.visible">
        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative flex flex-col bg-white shadow-sm rounded-xl overflow-hidden w-full max-w-2xl">
                <div class="p-4 sm:p-10 overflow-y-auto">
                    <div class="flex gap-x-4 md:gap-x-7">
                        <!-- Error icon -->
                        <span v-if="props.type === 'error'" class="flex-shrink-0 inline-flex justify-center items-center size-[46px] sm:w-[62px] sm:h-[62px] rounded-full border-4 border-red-50 bg-red-100 text-red-500">
                            <i class="fa-solid fa-circle-exclamation text-red-500 text-xl"></i>
                        </span>

                        <!-- Success icon -->
                        <span v-if="props.type === 'success'" class="flex-shrink-0 inline-flex justify-center items-center size-[46px] sm:w-[62px] sm:h-[62px] rounded-full border-4 border-green-50 bg-green-100 text-green-500">
                            <i class="fa-solid fa-circle-check text-green-500 text-xl"></i>
                        </span>

                        <!-- Text -->
                        <div class="grow">
                            <h3 class="mb-2 text-xl font-bold text-gray-800">{{ props.title }}</h3>
                            <p class="text-gray-500">{{ props.message }}</p>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex justify-end items-center gap-x-2 py-3 px-4 bg-gray-50">
                    <CustomButton type="secondary" text="Cancel" icon="fa-solid fa-times" @click="handleCloseDialog" />
                </div>
            </div>
        </div>
    </div>
</template>