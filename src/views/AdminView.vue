<script setup lang="ts">
import AdminDashboard from '@/components/AdminDashboard.vue'
</script>

<template>
  <div class="container max-w-5xl h-full mx-auto">
    <Suspense>
      <AdminDashboard />
      <template #fallback>
        <div>
          <p>Loading ... </p>
        </div>
      </template>
    </Suspense>
  </div>
</template>
