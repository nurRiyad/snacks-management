<script setup lang="ts">
import { useCurrentUser, useFirestore } from 'vuefire'
import { collection, getDocs, query } from 'firebase/firestore'
import { computed, ref } from 'vue'
import AdminTable from './AdminTable.vue'
import { useSnacksStore } from '@/stores/counter'

interface Order {
  name: string
  cost: number
  id: string
  amount: number
  total: number
}

interface OrderHistory {
  date: string
  totalCost: number
  orderedBy: string
  floor1: Array<Order>
  floor5: Array<Order>
}

const selectedDate = ref('')
const orderHistories = ref<Array<OrderHistory>>([])

async function getAllOrders() {
  const db = useFirestore()

  const url = '/snacks-history'
  const q = query(collection(db, url))

  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
    const data = doc.data() as OrderHistory
    if (data)
      orderHistories.value.push({ ...data })
  })

  selectedDate.value = orderHistories.value[0]?.date || ''
  return orderHistories
}

const selectedHistory = computed(() => {
  return orderHistories.value.find(hi => hi.date === selectedDate.value)
})

const snacksStore = useSnacksStore()
await getAllOrders()

await snacksStore.getUser()
const user = useCurrentUser()
</script>

<template>
  <div>
    <div class="flex m-5 space-x-3 items-baseline">
      <h1 class="text-xl font-semibold">
        Selected Date :
      </h1>
      <select v-model="selectedDate" class="select select-sm select-bordered">
        <option v-for="order in orderHistories" :key="order.date" :value="order.date">
          {{ new Date(order.date) }}
        </option>
      </select>
      <!-- Add other user information here -->
    </div>
    <div v-if="selectedHistory" class="mb-10 flex justify-center">
      <AdminTable :floor="1" :orders="selectedHistory?.floor1" :ttl-amount="selectedHistory?.totalCost" />
      <AdminTable :floor="5" :orders="selectedHistory?.floor5" :ttl-amount="selectedHistory?.totalCost" />
    </div>

    <div v-else>
      <p class="text-center font-bold text-warning py-10">
        Select date from select box to get order history
      </p>
    </div>

    <p class="text-center">
      Ordered by  <span class="font-semibold">{{ user?.displayName || user?.email }}</span>
    </p>
  </div>
</template>
