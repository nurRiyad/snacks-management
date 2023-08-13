<script setup lang="ts">
import AdminDashboard from '@/components/AdminDashboard.vue'
import Loader from '@/components/Loader.vue'
</script>

<template>
  <div class="container max-w-5xl h-full mx-auto">
    <Suspense>
      <AdminDashboard />
      <template #fallback>
        <div>
          <Loader />
        </div>
      </template>
    </Suspense>
  </div>
</template>
