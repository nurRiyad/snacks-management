<script setup lang="ts">
import { useCurrentUser } from 'vuefire'
import AdminTable from './AdminTable.vue'
import { useSnacksStore } from '@/stores/counter'

const snacksStore = useSnacksStore()

await snacksStore.getSnacksEnableUser()

const user = useCurrentUser()

function onPrintClick() {
  window.print()
}
</script>

<template>
  <div>
    <div class="mb-10 flex justify-center">
      <AdminTable :floor="1" />
      <AdminTable :floor="3" />
    </div>
    <div class="flex justify-center print:hidden">
      <button class="btn btn-primary m-3" @click="onPrintClick">
        Print The Doc
      </button>
    </div>

    <p class="hidden print:block">
      Ordered by {{ user?.displayName || user?.email }}
    </p>
  </div>
</template>
