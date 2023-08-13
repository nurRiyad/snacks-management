<script setup lang="ts">
import { useCurrentUser } from 'vuefire'

const user = useCurrentUser()
</script>

<template>
  <div class="mx-auto max-w-5xl px-24 mt-24 flex justify-center items-center">
    <div class="card card-side bg-base-100 shadow-xl">
      <figure><img :src="user?.photoURL || '/no-man.webp'" alt="Movie" class="w-32"></figure>
      <div class="card-body">
        <h2 class="card-title">
          {{ user?.displayName }}
        </h2>
        <p>{{ user?.email }}</p>
      </div>
    </div>
  </div>
</template>
