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
  <div class="m-5">
    <h1 class="text-center text-xl text-primary font-bold font-sans pb-5">
      <button class="btn btn-primary" @click="onPrintClick">
        Print Balance Sheet
      </button>
    </h1>
    <div class="overflow-x-auto border rounded-md ml-40 mr-40">
      <table class="table table-zebra">
        <!-- head -->
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Wallet</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, idx) in allUsers" :key="idx">
            <td>{{ idx }}</td>
            <td>{{ user.name }}</td>
            <td class="bg-primary" :style=" user.balance >= 0 ? 'color: white;' : 'color: red' ">
              {{ user.balance }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
