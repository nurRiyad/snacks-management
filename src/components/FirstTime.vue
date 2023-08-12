<script setup lang="ts">
import { ref } from 'vue'
import { useSnacksStore } from '@/stores/counter'

const snacksStore = useSnacksStore()

const username = ref('')
const floor = ref(1)

async function onSave() {
  await snacksStore.setUser(username.value, floor.value)
}
</script>

<template>
  <div class="flex flex-col space-y-4 items-center">
    <p class="text-primary font-bold text-2xl">
      Looks Like It's you first time
    </p>
    <div>
      <div class="form-control w-80 max-w-xs">
        <label class="label">
          <span class="label-text">Username</span>
        </label>
        <input v-model="username" type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs">
      </div>
    </div>
    <div class="form-control w-80 max-w-xs">
      <label class="label">
        <span class="label-text">Floor</span>
      </label>
      <select v-model="floor" class="select select-bordered">
        <option value="1">
          First
        </option>
        <option value="3">
          Third
        </option>
      </select>
    </div>
    <button class="btn btn-primary w-80" @click="onSave">
      Save
    </button>
  </div>
</template>
