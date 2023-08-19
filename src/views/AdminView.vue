<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminDashboard from '@/components/AdminDashboard.vue'
import Loader from '@/components/Loader.vue'
import { useSnacksStore } from '@/stores/counter'

const snacksStore = useSnacksStore()

const { loginUser } = storeToRefs(snacksStore)
const router = useRouter()

onMounted(async () => {
  await snacksStore.getUser()
  if (loginUser.value?.isAdmin !== true)
    router.replace('/')
})
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
