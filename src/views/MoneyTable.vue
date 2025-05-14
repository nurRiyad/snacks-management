<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useFirestore } from 'vuefire'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { type User, useSnacksStore } from '@/stores/counter'

const snacksStore = useSnacksStore()
const db = useFirestore()
const { allUsers } = storeToRefs(snacksStore)

// State for editing balance
const editingUserId = ref<string | null>(null)
const newBalance = ref<number>(0)

// State for confirmation dialog
const showDeleteModal = ref<boolean>(false)
const userToDelete = ref<{ id: string; name: string } | null>(null)

// State for clear orders confirmation dialog
const showClearModal = ref<boolean>(false)
const userToClear = ref<{ id: string; name: string } | null>(null)

// Load users when component mounts
snacksStore.getAllUser()

function onPrintClick(): void {
  window.print()
}

function startEditBalance(user: User): void {
  editingUserId.value = user.id
  newBalance.value = user.balance
}

async function saveBalance(userId: string): Promise<void> {
  try {
    const userRef = doc(db, `/snacks-users/${userId}`)
    await updateDoc(userRef, {
      balance: newBalance.value,
    })
    // Refresh the user list after update
    await snacksStore.getAllUser()
    editingUserId.value = null
  }
  catch (error) {
    console.error('Error updating balance:', error)
    alert('Failed to update balance')
  }
}

function cancelEdit(): void {
  editingUserId.value = null
}

function confirmDelete(user: User): void {
  userToDelete.value = { id: user.id, name: user.name }
  showDeleteModal.value = true
}

async function deleteUser(): Promise<void> {
  if (!userToDelete.value)
    return

  try {
    // Delete the user document
    await deleteDoc(doc(db, `/snacks-users/${userToDelete.value.id}`))

    // Refresh the user list
    await snacksStore.getAllUser()

    // Close the modal
    showDeleteModal.value = false
    userToDelete.value = null
  }
  catch (error) {
    console.error('Error deleting user:', error)
    alert('Failed to delete user')
  }
}

// New function to confirm clearing orders
function confirmClearOrders(user: User): void {
  userToClear.value = { id: user.id, name: user.name }
  showClearModal.value = true
}

// New function to clear user orders
async function clearOrders(): Promise<void> {
  if (!userToClear.value)
    return

  try {
    // Call the store function to clear orders
    await snacksStore.clearUserOrders(userToClear.value.id)

    // Close the modal
    showClearModal.value = false
    userToClear.value = null
  }
  catch (error) {
    console.error('Error clearing orders:', error)
    alert('Failed to clear orders')
  }
}

// Helper classes for styling
const buttonClass = 'px-2 py-1 rounded text-xs font-medium'
</script>

<template>
  <div class="container max-w-5xl h-full mx-auto p-5">
    <div class="flex my-3 justify-between">
      <h1 class="text-2xl font-bold text-primary">
        Balance Sheet
      </h1>
      <button class="btn btn-primary" @click="onPrintClick">
        Print Balance Sheet
      </button>
    </div>

    <div class="overflow-x-auto border rounded-md">
      <table class="table table-zebra">
        <!-- head -->
        <thead>
          <tr class="text-base">
            <th>No</th>
            <th>Name</th>
            <th>Wallet</th>
            <th class="print:hidden">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, idx) in allUsers" :key="user.id">
            <td>{{ idx + 1 }}</td>
            <td>{{ user.name }}</td>
            <td :style="user.balance >= 0 ? 'color: green;' : 'color: red'">
              <template v-if="editingUserId === user.id">
                <input
                  type="number"
                  v-model.number="newBalance"
                  class="w-24 px-2 py-1 border rounded"
                />
              </template>
              <template v-else>
                {{ user.balance }}
              </template>
            </td>
            <td class="print:hidden">
              <div class="flex gap-2">
                <template v-if="editingUserId === user.id">
                  <button
                    @click="saveBalance(user.id)"
                    class="bg-green-500 hover:bg-green-600 text-white"
                    :class="buttonClass"
                  >
                    Save
                  </button>
                  <button
                    @click="cancelEdit"
                    class="bg-gray-500 hover:bg-gray-600 text-white"
                    :class="buttonClass"
                  >
                    Cancel
                  </button>
                </template>
                <template v-else>
                  <button
                    @click="startEditBalance(user)"
                    class="bg-blue-500 hover:bg-blue-600 text-white"
                    :class="buttonClass"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDelete(user)"
                    class="bg-red-500 hover:bg-red-600 text-white"
                    :class="buttonClass"
                  >
                    Delete
                  </button>
                  <button
                    @click="confirmClearOrders(user)"
                    class="bg-yellow-500 hover:bg-yellow-600 text-white"
                    :class="buttonClass"
                  >
                    Clear
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete confirmation modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-bold mb-4">Confirm Delete</h3>
        <p>
          Are you sure you want to delete user
          <span class="font-semibold">{{ userToDelete?.name }}</span>?
        </p>
        <p class="text-red-500 text-sm mt-2">This action cannot be undone.</p>

        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            @click="deleteUser"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Clear orders confirmation modal -->
    <div
      v-if="showClearModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-bold mb-4">Confirm Clear Orders</h3>
        <p>
          Are you sure you want to clear all orders for user
          <span class="font-semibold">{{ userToClear?.name }}</span>?
        </p>
        <p class="text-yellow-500 text-sm mt-2">This action cannot be undone.</p>

        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="showClearModal = false"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            @click="clearOrders"
            class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
          >
            Clear Orders
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  .print\:hidden {
    display: none;
  }
}
</style>
