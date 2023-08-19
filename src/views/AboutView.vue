<script setup lang="ts">
import { useCurrentUser } from 'vuefire'

const user = useCurrentUser()
</script>

<template>
  <div class="mx-auto max-w-5xl px-24 mt-24 flex justify-center items-center">
    <div v-if="user?.email" class="card card-side bg-base-100 shadow-xl">
      <figure><img :src="user?.photoURL || '/no-man.webp'" alt="Movie" class="w-32"></figure>
      <div class="card-body">
        <h2 class="card-title">
          {{ user?.displayName }}
        </h2>
        <p>{{ user?.email }}</p>
      </div>
    </div>
    <div v-else>
      <h1 class="text-2xl py-8 ">
        No Log In user info found.Go Back to<RouterLink to="/" class="gray font-mono text-blue-800 mx-3">
          Home Page
        </RouterLink>
      </h1>
    </div>
  </div>
</template>
