<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSnacksStore } from '@/stores/counter'
import { foodItems } from '@/utils/foodItem'

interface Props {
  floor: number
}

const props = withDefaults(defineProps<Props>(), {
  floor: 0,
})

const snacksStore = useSnacksStore()

const { snacksEnabledUsers } = storeToRefs(snacksStore)

function calculateTotalAmount(foodId: string) {
  let count = 0
  snacksEnabledUsers.value.forEach((usr) => {
    if (usr.floor === props.floor) {
      usr.orders?.forEach((ord) => {
        if (ord.id === foodId)
          count += ord.amount
      })
    }
  })

  return count
}

function calculateTotalCost(foodId: string, cost: number) {
  const ttlAmount = calculateTotalAmount(foodId)

  return ttlAmount * cost
}

function generatedOrders() {
  return foodItems.map((food) => {
    return {
      name: food.name,
      cost: food.cost,
      id: food.id,
      amount: calculateTotalAmount(food.id),
      total: calculateTotalCost(food.id, food.cost),
    }
  }) || []
}

function filteredOrders() {
  const data = generatedOrders()

  return data.filter((odr) => {
    return odr.total !== 0
  }) || []
}

function overallAmount() {
  const allData = filteredOrders()
  let cost = 0

  allData.forEach((data) => {
    cost += data.total
  })

  return cost
}
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
          <tr v-for="(snacks, idx) in filteredOrders()" :key="snacks?.id + idx ">
            <td>{{ idx }}</td>
            <td>{{ snacks.name }}</td>
            <td>{{ snacks.cost }}</td>
            <td>{{ snacks.amount }}</td>
            <td>{{ snacks.total }}</td>
          </tr>

          <tr v-if="filteredOrders().length !== 0">
            <td colspan="4" class="text-center">
              Total Amount
            </td>
            <td colspan="4">
              {{ overallAmount() }}
            </td>
          </tr>

          <tr v-if="filteredOrders().length === 0">
            <td colspan="6" class="text-center">
              No Content Available !
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
