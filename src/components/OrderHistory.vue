<script setup lang="ts">
import { useFirestore } from 'vuefire'
import { Timestamp, collection, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore'
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
  date: string | Timestamp
  orderBy: string
  floor1: Array<Order>
  floor1Cost: number
  floor5: Array<Order>
  floor5Cost: number
  userList: Array<string>
}

const selectedDate = ref('')
const orderHistories = ref<Array<OrderHistory>>([])
const isLoading = ref(false)
const hasMoreOrders = ref(true)
const pageSize = 50 // Number of records to load at once

// Function to display date in a user-friendly format for the dropdown
function displayDate(dateInput: string | Timestamp | number): string {
  let date: Date
  if (dateInput instanceof Timestamp) {
    date = dateInput.toDate()
  }
  else if (typeof dateInput === 'string') {
    date = new Date(dateInput)
  }
  else if (typeof dateInput === 'number') {
    // Handle Unix timestamp in milliseconds
    date = new Date(dateInput)
  }
  else {
    // Fallback - should not happen but just in case
    return String(dateInput)
  }

  // Format: May 15, 2025, 2:30 PM
  return `${date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}, ${date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })}`
}

async function getAllOrders(loadMore = false) {
  isLoading.value = true
  try {
    const db = useFirestore()
    const url = '/snacks-history'

    // Create a base query ordered by date descending
    let baseQuery = query(
      collection(db, url),
      orderBy('date', 'desc'),
      limit(pageSize),
    )

    // If loading more, use the last document as a starting point
    if (loadMore && orderHistories.value.length > 0) {
      const lastDoc = orderHistories.value[orderHistories.value.length - 1]
      baseQuery = query(
        collection(db, url),
        orderBy('date', 'desc'),
        startAfter(lastDoc.date),
        limit(pageSize),
      )
    }

    const querySnapshot = await getDocs(baseQuery)

    // Check if there are no more documents
    if (querySnapshot.empty) {
      hasMoreOrders.value = false
      isLoading.value = false
      return orderHistories
    }

    const newHistories: OrderHistory[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data() as OrderHistory
      if (data)
        newHistories.push({ ...data })
    })

    // If loading more, append to existing history
    if (loadMore)
      orderHistories.value = [...orderHistories.value, ...newHistories]
    else
      orderHistories.value = newHistories
    // Set selected date if not already set and we have records
    if (!selectedDate.value && orderHistories.value.length) {
      const firstHistory = orderHistories.value[0]
      selectedDate.value = typeof firstHistory.date === 'string'
        ? firstHistory.date
        : firstHistory.date instanceof Timestamp
          ? firstHistory.date.toDate().toISOString()
          : String(firstHistory.date)
    }
  }
  catch (error) {
    console.error('Error fetching order history:', error)
  }
  finally {
    isLoading.value = false
  }

  return orderHistories
}

// Function to load more orders
async function loadMoreOrders() {
  if (!isLoading.value && hasMoreOrders.value)
    await getAllOrders(true)
}

const selectedHistory = computed(() => {
  return orderHistories.value.find((hi) => {
    // Handle different types of date storage
    if (hi.date instanceof Timestamp && selectedDate.value)
      return hi.date.toDate().toISOString() === selectedDate.value
    return String(hi.date) === selectedDate.value
  })
})

const snacksStore = useSnacksStore()
await getAllOrders()
await snacksStore.getUser()
</script>

<template>
  <div>
    <div v-if="selectedDate" class="flex m-5 space-x-3 items-baseline">
      <h1 class="text-xl font-semibold">
        Select Date:
      </h1>
      <select v-model="selectedDate" class="select select-sm select-bordered w-64">
        <option v-for="order in orderHistories" :key="String(order.date)"
          :value="order.date instanceof Timestamp ? order.date.toDate().toISOString() : String(order.date)">
          {{ displayDate(order.date) }}
        </option>
      </select>
    </div>

    <div v-if="selectedHistory">
      <div class="text-center mb-2">
        <h3 class="text-xl font-bold text-primary">
          {{ displayDate(selectedHistory.date) }}
        </h3>
      </div>

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
      Ordered by <span class="font-semibold">{{ selectedHistory?.orderBy }}</span>
    </p>

    <!-- Load more button -->
    <div class="flex justify-center my-5" v-if="hasMoreOrders">
      <button @click="loadMoreOrders" class="btn btn-primary" :disabled="isLoading">
        {{ isLoading ? 'Loading...' : 'Load More History' }}
      </button>
    </div>

    <p v-if="!hasMoreOrders && orderHistories.length > 0" class="text-center text-gray-500">
      All history loaded
    </p>
  </div>
</template>
