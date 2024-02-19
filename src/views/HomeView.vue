<script setup lang="ts">
import { type Order, useSnacksStore } from '@/stores/counter'

const snacksStore = useSnacksStore()

snacksStore.getUser()
snacksStore.getSnacksEnableUser()
snacksStore.getOrders()

function calculate(item: Order[] | undefined) {
  let items = ''
  let cost = 0
  item?.forEach((order: Order) => {
    if (items !== '')
      items += ','
    items += order.name
    cost += order.cost
  })

  items += `. Amount => ${cost}`
  return items
}
</script>

<template>
  <div class="mx-auto flex-col space-y-2 max-w-5xl flex justify-center items-center h-full">
    <h1 class="text-2xl py-8 ">
      Go to <RouterLink to="/snacks" class="gray font-mono text-blue-800 mx-3">
        /snacks
      </RouterLink> for order
    </h1>

    <div class="flex justify-between gap-12 text-center">
      <h1 class="text-center text-xl text-primary font-bold font-sans  mr-80">
        Floor:  <span class="text-bold"> 5 </span>
      </h1>
      <h1 class="text-center text-xl text-primary font-bold font-sans pb-5">
        Floor:  <span class="text-bold"> 1 </span>
      </h1>
    </div>
    <div class="flex justify-between gap-4">
      <!-- First Table -->
      <div class="overflow-x-auto border rounded-md flex-1">
        <table class="table table-zebra">
          <!-- head -->
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Orders</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(snacks, idx) in snacksStore.snacksEnabledUsers" :key="snacks?.id + idx ">
              <td v-if="snacks.floor === 5">
                {{ idx }}
              </td>
              <td v-if="snacks.floor === 5">
                {{ snacks.name }}
              </td>
              <td v-if="snacks.floor === 5">
                {{ calculate(snacks.orders) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Second Table -->
      <div class="overflow-x-auto border rounded-md flex-1">
        <table class="table table-zebra">
          <!-- head -->
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Orders</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(snacks, idx) in snacksStore.snacksEnabledUsers" :key="snacks?.id + idx ">
              <td v-if="snacks.floor === 1">
                {{ idx }}
              </td>
              <td v-if="snacks.floor === 1">
                {{ snacks.name }}
              </td>
              <td v-if="snacks.floor === 1">
                {{ calculate(snacks.orders) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
