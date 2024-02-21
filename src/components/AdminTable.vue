<script setup lang="ts">
import { useTotalOrders } from '@/composables/useTotalOrders'

interface Order {
  name: string
  cost: number
  id: string
  amount: number
  total: number
}

interface Props {
  floor?: number
  ttlAmount?: number
  orders?: Array<Order>
}

const props = withDefaults(defineProps<Props>(), {
  floor: 0,
  ttlAmount: 0,
  orders: () => ([]),
})

const { generatedOrders, overallAmount } = useTotalOrders()

const orders = generatedOrders(props.floor)
const ttlAmount = overallAmount(props.floor)
</script>

<template>
  <div class="m-5">
    <h1 class="text-center text-xl text-primary font-bold font-sans pb-5">
      Floor:  <span class="text-bold">{{ floor }}</span>
    </h1>
    <div class="overflow-x-auto border rounded-md">
      <table class="table table-zebra">
        <!-- head -->
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Cost</th>
            <th>Amount</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(snacks, idx) in orders" :key="snacks?.id + idx ">
            <td>{{ idx }}</td>
            <td>{{ snacks.name }}</td>
            <td>{{ snacks.cost }}</td>
            <td>{{ snacks.amount }}</td>
            <td>{{ snacks.total }}</td>
          </tr>

          <tr v-if="orders.length !== 0">
            <td colspan="4" class="text-center">
              Total Amount
            </td>
            <td colspan="4">
              {{ ttlAmount }}
            </td>
          </tr>

          <tr v-if="orders.length === 0">
            <td colspan="6" class="text-center">
              No Content Available !
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
