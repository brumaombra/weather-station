<script setup>
import CustomButton from '~/components/ui/CustomButton.vue';
import CustomModal from '~/components/CustomModal.vue';
import CustomSelect from '~/components/ui/CustomSelect.vue';
import CustomInput from '~/components/ui/CustomInput.vue';

// Props
const props = defineProps({
    visible: { type: Boolean, required: true },
    filters: { type: Object, default: () => ({}) },

    // Filter fields visibility
    startDateVisible: { type: Boolean, default: false },
    endDateVisible: { type: Boolean, default: false },
    orderByVisible: { type: Boolean, default: false },
    orderDirectionVisible: { type: Boolean, default: false },
    measurementTypeVisible: { type: Boolean, default: false }
});

// Emits
const emits = defineEmits(['apply', 'update:visible']);

// Handle close press
const handleClosePress = () => {
    emits('update:visible', false);
};

// Handle apply press
const handleApplyPress = () => {
    emits('apply', props.filters);
    emits('update:visible', false);
};
</script>

<template>
    <CustomModal :visible="props.visible" title="Filter" icon="fa-solid fa-filter">
        <!-- Body -->
        <template #body>
            <div>
                <form class="space-y-4">
                    <!-- Start date -->
                    <div v-if="props.startDateVisible">
                        <label class="block mb-2 text-sm font-medium dark:text-neutral-200">Start date</label>
                        <CustomInput v-model="props.filters.startDate" type="date" />
                    </div>

                    <!-- End date -->
                    <div v-if="props.endDateVisible">
                        <label class="block mb-2 text-sm font-medium dark:text-neutral-200">End date</label>
                        <CustomInput v-model="props.filters.endDate" type="date" />
                    </div>

                    <!-- Order by -->
                    <div v-if="props.orderByVisible">
                        <label class="block mb-2 text-sm font-medium dark:text-neutral-200">Order by</label>
                        <CustomSelect v-model="props.filters.orderBy">
                            <option value="timestamp">Timestamp</option>
                            <option value="temperature">Temperature</option>
                            <option value="humidity">Humidity</option>
                            <option value="pressure">Pressure</option>
                            <option value="gas">Gas</option>
                            <option value="pm1">PM1</option>
                            <option value="pm25">PM2.5</option>
                            <option value="pm10">PM10</option>
                        </CustomSelect>
                    </div>

                    <!-- Order direction -->
                    <div v-if="props.orderDirectionVisible">
                        <label class="block mb-2 text-sm font-medium dark:text-neutral-200">Order direction</label>
                        <CustomSelect v-model="props.filters.orderDirection">
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </CustomSelect>
                    </div>

                    <!-- Measurements type -->
                    <div v-if="props.measurementTypeVisible">
                        <label class="block mb-2 text-sm font-medium dark:text-neutral-200">Measurements type</label>
                        <CustomSelect v-model="props.filters.measurementType">
                            <option value="all">All</option>
                            <option value="ano">Anomalous</option>
                            <option value="nor">Normal</option>
                        </CustomSelect>
                    </div>
                </form>
            </div>
        </template>

        <!-- Footer -->
        <template #footer>
            <CustomButton type="secondary" text="Cancel" icon="fa-solid fa-times" @click="handleClosePress" />
            <CustomButton type="primary" text="Apply" icon="fa-solid fa-check" @click="handleApplyPress" />
        </template>
    </CustomModal>
</template>