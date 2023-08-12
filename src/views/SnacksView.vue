<script setup lang="ts">
import { ref } from 'vue'
import Vtable from '@/components/VTable.vue'
import Modal from '@/components/Modal.vue'

const isSnacksEnable = ref(false)
const showModal = ref(false)
</script>

<template>
  <div class="mx-auto max-w-7xl px-5">
    <div class="flex justify-between pt-8  border-b border-primary">
      <h1 class="text-primary text-3xl font-bold">
        Enable Snacks
      </h1>
      <div class="form-control">
        <label class="cursor-pointer label">
          <input v-model="isSnacksEnable" type="checkbox" class="toggle toggle-primary" checked>
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
        <p class="text-secondary font-bold">
          Enable Snacks from toggle button to order item
        </p>
      </div>
    </div>
  </div>
</template>
