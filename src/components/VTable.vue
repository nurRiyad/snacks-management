<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useSnacksStore } from '@/stores/counter'
import DeleteModal from '@/components/DeleteModal.vue'

const snacksStore = useSnacksStore()

const { orders } = storeToRefs(snacksStore)

const totalAmount = computed(() => {
  let count = 0
  orders.value.forEach((order) => {
    const temp = order.cost * order.amount
    count += temp
  })

  return count
})

const showModal = ref(false)
const selectedRowId = ref('')
async function onRemoveClick(id: string) {
  selectedRowId.value = id
  showModal.value = true
}
</script>

<template>
  <div class="overflow-x-auto border rounded-md mt-5">
    <table class="table table-zebra">
      <!-- head -->
      <thead>
        <tr>
          <th>
            Item No
          </th>
          <th>Name</th>
          <th>Cost</th>
          <th>Amount</th>
          <th>Total</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(snacks, idx) in orders" :key="snacks?.id + idx ">
          <td>
            {{ idx }}
          </td>
          <td>{{ snacks.name }}</td>
          <td>{{ snacks.cost }}</td>
          <td>{{ snacks.amount }}</td>
          <td>{{ snacks.cost * snacks.amount }}</td>
          <td class="w-36">
            <button class="btn btn-error btn-sm" @click="onRemoveClick(snacks.uid)">
              Remove
            </button>
          </td>
        </tr>

        <tr v-if="orders.length !== 0">
          <td colspan="4" class="text-center">
            Total Amount
          </td>
          <td colspan="4">
            {{ totalAmount }}
          </td>
        </tr>

        <tr v-if="orders.length === 0">
          <td colspan="6" class="text-center">
            No Content Available !
          </td>
        </tr>
      </tbody>
    </table>
    <DeleteModal :show-modal="showModal" :uid="selectedRowId" @close-modal="showModal = false" />
  </div>
</template>
