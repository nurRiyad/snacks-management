<script setup lang="ts">
import { useCurrentUser, useFirestore } from 'vuefire'
import { storeToRefs } from 'pinia'
import { doc, setDoc } from 'firebase/firestore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminTable from './AdminTable.vue'
import AdminAction from './AdminAction.vue'

import ConfirmModal from './ConfirmModal.vue'
import { type Order, type User, useSnacksStore } from '@/stores/counter'
import { useTotalOrders } from '@/composables/useTotalOrders'

const snacksStore = useSnacksStore()

await snacksStore.getSnacksEnableUser()
await snacksStore.getAllUser()

const showModal = ref(false)
const isLoading = ref(false)

const user = useCurrentUser()
const { snacksEnabledUsers } = storeToRefs(snacksStore)

function onOnlyPrintClick() {
  window.print()
}

function orderAmountOfUser(orders: Array<Order>) {
  let sum = 0
  orders.forEach(order => sum += order.is_item_enabled ? (order.amount * order.cost) : 0)
  return sum
}

async function updateUserBalance(user: User) {
  const orders = user.orders || []

  const db = useFirestore()

  const url = `/snacks-users/${user?.id}`

  const docRef = doc(db, url)

  const orderAmount = orderAmountOfUser(orders)
  const payload = {
    name: user.name,
    balance: user.balance - orderAmount,
    lastOrdered: new Date().toISOString(),
  }
  await setDoc(docRef, payload, { merge: true })
}

async function updateHistory() {
  console.error('Update history')
}

async function onOrderAndPrintClick() {
  try {
    showModal.value = false
    isLoading.value = true
    await Promise.all(
      snacksEnabledUsers.value.map(async (user) => {
        await updateUserBalance(user)
      }),
    )

    await snacksStore.getSnacksEnableUser()
    await snacksStore.getAllUser()

    await updateHistory()

    window.print()
  }
  catch (error) {
    console.error(error)
  }
  isLoading.value = false
}

const router = useRouter()
function handleBalanceSheetClick() {
  router.push('/admin/balance')
}

const { generatedOrders, overallAmount } = useTotalOrders()

const ordersForFloor1 = generatedOrders(1)
const ttlAmountForFloor1 = overallAmount(1)

const ordersForFloor5 = generatedOrders(5)
const ttlAmountForFloor5 = overallAmount(5)
</script>

<template>
  <div>
    <div class="print:hidden">
      <AdminAction />
    </div>

    <div class="mb-10 flex justify-center">
      <AdminTable :floor="1" :orders="ordersForFloor1" :ttl-amount="ttlAmountForFloor1" />
      <AdminTable :floor="5" :orders="ordersForFloor5" :ttl-amount="ttlAmountForFloor5" />
    </div>
    <div class="flex justify-center print:hidden">
      <button :disabled="isLoading" class="btn btn-primary m-3" @click="handleBalanceSheetClick">
        Balance Sheet
      </button>

      <button :disabled="isLoading" class="btn btn-primary m-3" @click="onOnlyPrintClick">
        Print Order
      </button>

      <button class="btn btn-error m-3" :class="{ loading: isLoading }" @click="showModal = !showModal">
        Order & Print
      </button>
    </div>
    <ConfirmModal
      :show-modal="showModal"
      :is-loading="isLoading"
      @close-modal="showModal = false"
      @confirm-modal="onOrderAndPrintClick"
    />
    <p class="hidden print:block">
      Ordered by {{ user?.displayName || user?.email }}
    </p>
  </div>
</template>
