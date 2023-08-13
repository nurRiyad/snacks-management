<script setup lang="ts">
import AdminTable from './AdminTable.vue'
import { useSnacksStore } from '@/stores/counter'

const snacksStore = useSnacksStore()

await snacksStore.getSnacksEnableUser()
</script>

<template>
  <div class="space-y-5 mb-10 flex flex-col">
    <AdminTable :floor="1" />
    <AdminTable :floor="3" />

    <button class="mx-auto btn btn-primary">
      Print
    </button>
  </div>
</template>
