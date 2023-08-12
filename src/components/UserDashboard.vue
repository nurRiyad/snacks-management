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
    <div class="flex justify-between pt-8  border-b border-primary">
      <h1 class="text-primary text-3xl font-bold">
        Enable Snacks
      </h1>
      <div class="form-control">
        <label class="cursor-pointer label">
          <input v-model="isSnacksEnable" :disabled="showFirstTimeModal" type="checkbox" class="toggle toggle-primary">
        </label>
      </div>
    </div>
    <div>
      <div v-if="isSnacksEnable">
        <div class="flex justify-between py-4">
          <h1 class="text-xl font-semibold">
            Odored Snacks List
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
