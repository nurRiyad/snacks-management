<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSnacksStore } from '@/stores/counter'

const snacksStore = useSnacksStore()

const { allUsers } = storeToRefs(snacksStore)
function onPrintClick() {
  window.print()
}
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
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, idx) in allUsers" :key="idx">
            <td>{{ idx }}</td>
            <td>{{ user.name }}</td>
            <td :style=" user.balance >= 0 ? 'color: green;' : 'color: red' ">
              {{ user.balance }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
