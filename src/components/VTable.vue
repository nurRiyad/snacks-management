<script setup lang="ts">
import { collection } from 'firebase/firestore'
import { getCurrentUser, useCollection, useFirestore } from 'vuefire'

const db = useFirestore()
const user = await getCurrentUser()

const allSnacks = useCollection(collection(db, `/users/${user?.uid}/snacks`))
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
        <tr v-for="(snacks, idx) in allSnacks" :key="snacks.id">
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
