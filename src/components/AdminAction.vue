<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useSnacksStore } from '@/stores/counter'
import AddMoneyModal from '@/components/AddMoneyModal.vue'

const snacksStore = useSnacksStore()

const { snacksEnabledUsers } = storeToRefs(snacksStore)

const showModal = ref(false)

const totalBalance = computed(() => {
  return snacksEnabledUsers.value.reduce((pre, curr) => {
    return pre += curr.balance || 0
  }, 0) || 0
})
</script>

<template>
  <div>
    <div class="flex justify-around mt-4">
      <div class="card w-96 bg-base-200 shadow-xl p-5">
        <button class="btn btn-primary" @click="showModal = !showModal">
          Add Money
        </button>
      </div>
      <div class="card w-96 bg-base-200 shadow-xl p-5 justify-center">
        <div class="flex space-x-5 items-center justify-between">
          <h2 class="card-title">
            Total Amount
          </h2>

          <div class="form-control">
            <p>{{ totalBalance }} Tk</p>
          </div>
        </div>
      </div>
    </div>
    <AddMoneyModal :show-modal="showModal" @close-modal="showModal = false" />
    <div class="divider" />
  </div>
</template>
