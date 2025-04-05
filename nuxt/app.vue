<script setup>
import { useGlobalStore } from '~/composables/stores/useGlobalStore.js';
import MessageDialog from '~/components/MessageDialog.vue';
import MessageToast from '~/components/MessageToast.vue';
import BusyIndicator from '~/components/BusyIndicator.vue';

// Global store
const globalStore = useGlobalStore();
</script>

<template>
    <!-- Main content -->
    <NuxtPage />

    <!-- Busy indicator -->
    <BusyIndicator :visible="globalStore.busy" />

    <!-- Message dialog -->
    <MessageDialog :visible="globalStore.dialog.visible"
        :type="globalStore.dialog.type"
        :title="globalStore.dialog.title"
        :message="globalStore.dialog.message"
        @update:visible="globalStore.dialog.visible = $event" />

    <!-- Message toast -->
    <MessageToast :visible="globalStore.toast.visible"
        :type="globalStore.toast.type"
        :message="globalStore.toast.message"
        @update:visible="globalStore.toast.visible = $event" />
</template>