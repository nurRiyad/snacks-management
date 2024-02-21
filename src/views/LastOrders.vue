<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import Loader from '@/components/Loader.vue'

const LastOrders = defineAsyncComponent(() => import('@/components/OrderHistory.vue'))
</script>

<template>
  <div class="mx-auto max-w-5xl px-5">
    <Suspense>
      <LastOrders />
      <template #fallback>
        <Loader />
      </template>
    </Suspense>
  </div>
</template>
