<script setup lang="ts">
import UserDashboard from '@/components/UserDashboard.vue'
import Loader from '@/components/Loader.vue'
</script>

<template>
  <div class="mx-auto max-w-5xl px-5">
    <Suspense>
      <UserDashboard />
      <template #fallback>
        <Loader />
      </template>
    </Suspense>
  </div>
</template>
