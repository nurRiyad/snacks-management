<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useSnacksStore } from '@/stores/counter'

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
</script>

<template>
  <div class="overflow-x-auto border rounded-md mt-5">
    <table class="table table-zebra">
      <!-- head -->
      <thead>
        <tr>
          <th>Item No</th>
          <th>Name</th>
          <th>Cost</th>
          <th>Amount</th>
          <th>Total</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(snacks, idx) in orders" :key="snacks?.id + idx ">
          <th>{{ idx }}</th>
          <td>{{ snacks.name }}</td>
          <td>{{ snacks.cost }}</td>
          <td>{{ snacks.amount }}</td>
          <td>{{ snacks.cost * snacks.amount }}</td>
          <td>
            <button class="btn btn-error btn-sm">
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
            There is Content Available !
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
