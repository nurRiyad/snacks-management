<script setup lang="ts">
import UserDashboard from '@/components/UserDashboard.vue'
</script>

<template>
  <div class="mx-auto max-w-7xl px-5">
    <Suspense>
      <UserDashboard />
      <template #fallback>
        Loading ...
      </template>
    </Suspense>
  </div>
</template>
