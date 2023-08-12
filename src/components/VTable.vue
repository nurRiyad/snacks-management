<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSnacksStore } from '@/stores/counter'

const snacksStore = useSnacksStore()

const { orders } = storeToRefs(snacksStore)
</script>

<template>
  <div class="overflow-x-auto border rounded-md mt-5">
    <table class="table table-zebra">
      <!-- head -->
      <thead>
        <tr>
          <th>Item No</th>
          <th>Name</th>
          <th>Cost</th>
          <th>Amount</th>
          <th>Total</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
        <tr v-for="(snacks, idx) in orders" :key="snacks?.id + idx ">
          <th>{{ idx }}</th>
          <td>{{ snacks.name }}</td>
          <td>{{ snacks.cost }}</td>
          <td>{{ snacks.amount }}</td>
          <td>{{ snacks.cost * snacks.amount }}</td>
          <td>
            <button class="btn btn-error btn-sm">
              Remove
            </button>
          </td>
        </tr>
        <!-- row 2 -->
      </tbody>
    </table>
  </div>
</template>
