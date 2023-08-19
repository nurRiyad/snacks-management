<script setup lang="ts">
import { useCurrentUser } from 'vuefire'
import { getAuth, signOut } from 'firebase/auth'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSnacksStore } from '@/stores/counter'

const user = useCurrentUser()
const router = useRouter()
const route = useRoute()
const snackStore = useSnacksStore()

const { loginUser } = storeToRefs(snackStore)

const isRoot = computed(() => (route.fullPath === '/'))
const isSnacks = computed(() => route.fullPath === '/snacks')
const isAdmin = computed(() => route.fullPath === '/admin')

async function onLogoutClick() {
  try {
    const auth = getAuth()
    await signOut(auth)

    snackStore.resetStore()
    router.push('/')
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}
</script>

<template>
  <header class="border-b">
    <div class="navbar bg-base-100 mx-auto max-w-5xl">
      <div class="flex-1">
        <RouterLink
          to="/"
          class="btn btn-ghost normal-case text-xl"
          :class="{ 'text-primary': isRoot }"
        >
          Home
        </RouterLink>
        <RouterLink
          v-if="user"
          to="/snacks"
          class="btn btn-ghost normal-case text-xl"
          :class="{ 'text-primary': isSnacks }"
        >
          Snacks
        </RouterLink>
        <RouterLink
          v-if="loginUser?.isAdmin"
          to="/admin"
          class="btn btn-ghost normal-case text-xl"
          :class="{ 'text-primary': isAdmin }"
        >
          Dashboard
        </RouterLink>
      </div>
      <div class="flex-none">
        <RouterLink v-if="!user" to="/signin" class="btn btn-primary">
          SignIn
        </RouterLink>
        <div v-else class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img :src="user?.photoURL || '/no-man.webp'">
            </div>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-2 z-[1] p-2 shadow bg-base-100 rounded-box w-36 space-y-1">
            <li>
              <RouterLink to="/about" class="justify-between">
                Profile
              </RouterLink>
            </li>
            <li v-if="loginUser?.isAdmin">
              <RouterLink to="/admin">
                Admin
              </RouterLink>
            </li>
            <li @click="onLogoutClick">
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>
