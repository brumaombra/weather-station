<script setup>
import GlobalStore from '@/stores/global.js';
</script>

<template>
    <div id="globalMessageDialog" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">
                        <i class="fa-solid fa-circle-check me-2 text-success" v-if="GlobalStore.dialog.type === 'success'"></i>
                        <i class="fa-solid fa-circle-exclamation me-2 text-danger" v-if="GlobalStore.dialog.type === 'error'"></i>
                        {{ GlobalStore.dialog.type === 'success' ? 'Success' : 'Error' }}
                    </h1>
                </div>
                <div class="modal-body">
                    <p class="mb-0">{{ GlobalStore.dialog.message }}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal" v-if="GlobalStore.dialog.type === 'success'">CLOSE</button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" v-if="GlobalStore.dialog.type === 'error'">CLOSE</button>
                </div>
            </div>
        </div>
    </div>
</template>