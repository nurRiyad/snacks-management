<script setup lang="ts">
import Hero from '@/components/Hero.vue'
import { useSnacksStore } from '@/stores/counter'

const snacksStore = useSnacksStore()

snacksStore.getUser()
</script>

<template>
  <div class="mx-auto flex-col space-y-2 max-w-5xl flex justify-center items-center h-full">
    <h1 class="text-2xl py-8 ">
      Go to <RouterLink to="/snacks" class="gray font-mono text-blue-800 mx-3">
        /snacks
      </RouterLink> for order
    </h1>
    <Hero />
    <h1 class="text-xl pt-5 font-bold ">
      Start Your Day With Motivation !
    </h1>
  </div>
</template>
