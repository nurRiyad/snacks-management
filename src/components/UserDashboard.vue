<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import Vtable from '@/components/VTable.vue'
import Modal from '@/components/Modal.vue'
import FirstTime from '@/components/FirstTime.vue'
import { useSnacksStore } from '@/stores/counter'

const snacksStore = useSnacksStore()

await snacksStore.getUser()
await snacksStore.getOrders()

const isSnacksEnable = ref(false)
const showModal = ref(false)
const showFirstTimeModal = ref(false)

const { loginUser } = storeToRefs(snacksStore)

watch(() => loginUser.value?.snacks_enabled, (n) => {
  if (n)
    isSnacksEnable.value = true
}, { immediate: true })

watch(isSnacksEnable, async (n) => {
  await snacksStore.updateSnakesOptions(n)
})

watch(() => loginUser.value?.id, (n) => {
  if (!n)
    showFirstTimeModal.value = true
  else showFirstTimeModal.value = false
}, { immediate: true })
</script>

<template>
  <div>
    <div class="flex justify-around mt-4">
      <div class="card w-96 bg-base-200 p-5">
        <div class="flex space-x-5 items-center justify-between">
          <h2 v-if="isSnacksEnable" class="card-title">
            Disable Snacks
          </h2>
          <h2 v-else class="card-title">
            Enable Snacks
          </h2>
          <div class="form-control">
            <label class="cursor-pointer label">
              <input v-model="isSnacksEnable" :disabled="showFirstTimeModal" type="checkbox" class="toggle toggle-primary">
            </label>
          </div>
        </div>
      </div>
      <div class="card w-96 bg-base-200 p-5 justify-center">
        <div class="flex space-x-5 items-center justify-between">
          <h2 class="card-title">
            Balance
          </h2>

          <div class="form-control">
            <p>{{ loginUser?.balance || '0' }} Tk</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="loginUser?.balance && loginUser?.balance <= 0" class="text-red-500 text-sm mt-2 justify-center text-center">
      Your balance is low, please contact with authority to recharge.
    </div>
    <div class="divider" />
    <div>
      <div v-if="isSnacksEnable">
        <div class="flex justify-between py-4">
          <h1 class="text-xl font-semibold">
            Ordered Snacks List
          </h1>
          <button class="btn btn-primary btn-sm" @click="showModal = !showModal">
            Add New Item
          </button>
        </div>
        <div>
          <Vtable />
        </div>
        <Modal :show-modal="showModal" @close-modal="showModal = false" />
      </div>
      <div v-else class="flex justify-center pt-20">
        <div v-if="showFirstTimeModal">
          <FirstTime />
        </div>
        <div v-else>
          <p class="text-secondary font-bold">
            Enable Snacks from toggle button to order item
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
