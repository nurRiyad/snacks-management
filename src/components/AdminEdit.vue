<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useFirestore } from 'vuefire'
import { collection, getDocs, query } from 'firebase/firestore'
import Loader from '@/components/Loader.vue'
import Modal from '@/components/Modal.vue'
import { type Order, useSnacksStore } from '@/stores/counter'

const snacksStore = useSnacksStore()

await snacksStore.getAllUser()

const isOrdersDataFetching = ref(false)
const orders = ref<Array<Order>>([])
const showModal = ref(false)
const selectedUser = ref('')

async function getOrdersForUserId(uid: string) {
  isOrdersDataFetching.value = true

  const db = useFirestore()

  const url = `/snacks-users/${uid}/snacks`

  const q = query(collection(db, url))

  const querySnapshot = await getDocs(q)
  const allData: Array<Order> = []
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    const data = doc.data() as Order
    if (data)
      allData.push({ ...data, uid: doc.id })
  })

  orders.value = allData

  isOrdersDataFetching.value = false
}

watch(selectedUser, (n) => {
  getOrdersForUserId(n)
})

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
  <div class="container max-w-5xl h-full mx-auto p-5">
    <div v-if="snacksStore.isUserDataFetching">
      <Loader />
    </div>

    <div v-else>
      <!-- User Information Section -->
      <div class="flex justify-between items-baseline">
        <div class="flex m-5 space-x-3 items-baseline">
          <h1 class="text-xl font-semibold">
            Selected User :
          </h1>
          <select v-model="selectedUser" class="select select-sm select-bordered">
            <option v-for="user in snacksStore.allUsers" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
          <!-- Add other user information here -->
        </div>

        <!-- Add New Item Button -->
        <button :disabled="selectedUser === ''" class="btn btn-primary btn-sm ml-10" @click="showModal = !showModal">
          Add New Item
        </button>
      </div>
      <!-- Orders Table -->
      <div class="overflow-x-auto border rounded-md">
        <div v-if="isOrdersDataFetching">
          <Loader />
        </div>
        <table v-else class="table table-zebra mt-4">
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
            <tr v-for="(snacks, idx) in orders" :key="snacks.id + idx">
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
            <tr v-if="orders.length === 0">
              <td colspan="6" class="text-center">
                No User Selected !
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Component -->
      <Modal :show-modal="showModal" :updated-user="allData" @close-modal="showModal = false" />
    </div>
  </div>
</template>
