<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import ToggleUserModal from './ToggleUserModal.vue'
import { useSnacksStore } from '@/stores/counter'
import AddMoneyModal from '@/components/AddMoneyModal.vue'

const snacksStore = useSnacksStore()

const selectedUser = ref('')

const { allUsers } = storeToRefs(snacksStore)

const showModal = ref(false)

const toggleUser = ref(false)

const totalBalance = computed(() => {
  return allUsers.value.reduce((pre, curr) => {
    return pre += curr.balance || 0
  }, 0) || 0
})

function updateUser(uid: string) {
  snacksStore.getSelectedUser(uid)
}
</script>

<template>
  <div>
    <div class="flex justify-around mt-4">
      <div class="card w-96 bg-base-200 space-x-4  p-5">
        <div class="flex justify-around">
          <button class="btn btn-primary" @click="showModal = !showModal">
            Add Money
          </button>
          <button class="btn btn-primary" @click="toggleUser = !toggleUser">
            Toggle user
          </button>
        </div>
      </div>
      <div class="card w-130 bg-base-200  p-5 justify-center">
        <div class="flex space-x-5 items-center justify-between">
          <h2 class="card-title">
            Total Amount
          </h2>
          <div class="form-control bg-lime-500">
            <p>{{ totalBalance }} Tk</p>
          </div>
          <h2>
            <select v-model="selectedUser" class="select select-bordered flex">
              <option v-for="user in snacksStore.allUsers" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </h2>
          <RouterLink to="/edit">
            <button class="btn btn-primary" @click="updateUser(selectedUser)">
              Edit User
            </button>
          </RouterLink>
        </div>
      </div>
    </div>
    <AddMoneyModal :show-modal="showModal" @close-modal="showModal = false" />
    <ToggleUserModal :show-modal="toggleUser" @close-modal="toggleUser = false" />
    <div class="divider" />
  </div>
</template>
