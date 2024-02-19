<script setup lang="ts">
import { useCurrentUser } from 'vuefire'
import AdminTable from './AdminTable.vue'

import { useSnacksStore } from '@/stores/counter'

const snacksStore = useSnacksStore()

await snacksStore.getSnacksEnableUser()
await snacksStore.getAllUser()

const user = useCurrentUser()
</script>

<template>
  <div>
    <div class="mb-10 flex justify-center">
      <AdminTable :floor="1" />
      <AdminTable :floor="5" />
    </div>

    <p class="hidden print:block">
      Ordered by {{ user?.displayName || user?.email }}
    </p>
  </div>
</template>
