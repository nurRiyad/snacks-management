<script setup lang="ts">
import { computed, ref } from 'vue'
import Loader from '@/components/Loader.vue'
import Modal from '@/components/Modal.vue'
import { useSnacksStore } from '@/stores/counter'

const showModal = ref(false)
const snacksStore = useSnacksStore()
const allData = computed(() => snacksStore.selectedUser)
function updateList(uid: string, is_item_enabled: boolean, user_id: string | undefined) {
  if (user_id !== undefined)
    snacksStore.updateOrderEnabledStatus(uid, is_item_enabled, user_id)
}
function updateAmount(uid: string, amount: number, user_id: string | undefined) {
  if (user_id !== undefined)
    snacksStore.updateOrderAmount(uid, amount, user_id)
}
</script>

<template>
  <div v-if="snacksStore.isUserDataFetching">
    <Loader />
  </div>
  <div v-else class="border rounded-md mt-5">
    <!-- User Information Section -->
    <div class="flex justify-center">
      <div class="mb-4">
        <h2>User Information: {{ allData?.name }}</h2>
      <!-- Add other user information here -->
      </div>

      <!-- Add New Item Button -->
      <button class="btn btn-primary btn-sm ml-10" @click="showModal = !showModal">
        Add New Item
      </button>
    </div>
    <!-- Orders Table -->
    <table class="table table-zebra mt-4">
      <!-- Table Headings -->
      <thead>
        <tr>
          <th>Toggle Item</th>
          <th>Name</th>
          <th>Cost</th>
          <th>Amount</th>
          <th>Total</th>
        </tr>
      </thead>

      <!-- Table Body -->
      <tbody>
        <tr v-for="(snacks, idx) in allData?.orders" :key="snacks.id + idx">
          <!-- Checkbox for Toggle Item -->
          <td>
            <input v-model="snacks.is_item_enabled" type="checkbox" class="toggle toggle-primary" @change="updateList(snacks.uid, snacks.is_item_enabled, allData?.id)">
          </td>

          <!-- Name -->
          <td>{{ snacks.name }}</td>

          <!-- Cost -->
          <td>{{ snacks.cost }}</td>

          <!-- Amount Input -->
          <td>
            <input v-model="snacks.amount" type="number" placeholder="Type here" class="input input-bordered w-full max-w-xs" @change="updateAmount(snacks.uid, snacks.amount, allData?.id)">
          </td>

          <!-- Total -->
          <td>{{ snacks.cost * snacks.amount }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Component -->
    <Modal :show-modal="showModal" :updated-user="allData" @close-modal="showModal = false" />
  </div>
</template>
