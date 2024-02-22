<script setup lang="ts">
import { useFirestore } from 'vuefire'
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
  orderBy: string
  floor1: Array<Order>
  floor1Cost: number
  floor5: Array<Order>
  floor5Cost: number
  userList: Array<string>
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

  orderHistories.value.sort((a, b) => String(b.date).localeCompare(a.date))

  if (orderHistories.value.length)
    selectedDate.value = orderHistories.value[0]?.date || ''

  return orderHistories
}

const selectedHistory = computed(() => {
  return orderHistories.value.find(hi => hi.date === selectedDate.value)
})

const snacksStore = useSnacksStore()
await getAllOrders()

await snacksStore.getUser()
</script>

<template>
  <div>
    <div v-if="selectedDate" class="flex m-5 space-x-3 items-baseline">
      <h1 class="text-xl font-semibold">
        Select Date :
      </h1>
      <select v-model="selectedDate" class="select select-sm select-bordered">
        <option v-for="order in orderHistories" :key="order.date" :value="order.date">
          {{ new Date(order.date) }}
        </option>
      </select>
      <!-- Add other user information here -->
    </div>
    <div v-if="selectedHistory">
      <div>
        <h4 class="text-xl text-center text-primary font-semibold">
          Ordered User list
        </h4>
        <div class="flex justify-center font-semibold space-x-5 py-5">
          <p v-for="usr in selectedHistory.userList" :key="usr">
            {{ usr }}
          </p>
          <p v-if="!selectedHistory.userList?.length">
            No user in the list
          </p>
        </div>
      </div>
      <div class="">
        <AdminTable :floor="1" :orders="selectedHistory?.floor1" :ttl-amount="selectedHistory?.floor1Cost" />
        <AdminTable :floor="5" :orders="selectedHistory?.floor5" :ttl-amount="selectedHistory?.floor5Cost" />
      </div>
    </div>

    <div v-else>
      <p class="text-center font-bold text-warning py-10">
        Currently No Order History Available
      </p>
    </div>

    <p v-if="selectedDate" class="text-center p-5">
      Ordered by  <span class="font-semibold">{{ selectedHistory?.orderBy }}</span>
    </p>
  </div>
</template>
