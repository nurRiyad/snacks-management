<script setup lang="ts">
import { addDoc, collection } from 'firebase/firestore'
import { computed, ref, watch } from 'vue'
import { getCurrentUser, useFirestore } from 'vuefire'
import { useSnacksStore } from '@/stores/counter'

interface Props {
  showModal: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showModal: false,
})

const emits = defineEmits(['closeModal'])

const snacksStore = useSnacksStore()

const my_modal_1 = ref<HTMLDialogElement | null>(null)
const itemAmount = ref(0)
const itemId = ref('')
const isAdding = ref(false)

const foodItems = [
  {
    name: 'Mug Dal',
    id: 'mugdal',
    cost: 20,
  },
  {
    name: 'Ruti',
    id: 'ruti',
    cost: 20,
  },
]

watch(() => props.showModal, (n) => {
  if (n) {
    my_modal_1.value?.showModal()
  }
  else {
    emits('closeModal')
    my_modal_1.value?.close()
  }
}, { immediate: true })

const selectedItem = computed(() => foodItems.find(item => item.id === itemId.value))

async function addNedItem() {
  if (selectedItem.value) {
    try {
      isAdding.value = true

      const user = await getCurrentUser()
      const db = useFirestore()

      const obj = {
        name: selectedItem.value.name,
        id: selectedItem.value.id,
        cost: selectedItem.value.cost,
        amount: itemAmount.value,
      }
      const url = `users/${user?.uid}/snacks`

      await addDoc(
        collection(db, url),
        obj,
      )

      snacksStore.getOrders()

      itemId.value = ''
      itemAmount.value = 0

      emits('closeModal')
    }
    catch (error) {

    }

    isAdding.value = false
  }
}
</script>

<template>
  <div @keydown.esc="$emit('closeModal')">
    <!-- Open the modal using ID.showModal() method -->
    <dialog id="my_modal_1" ref="my_modal_1" class="modal">
      <form method="dialog" class="modal-box">
        <h3 class="font-bold text-xl py-3">
          Add New Item
        </h3>
        <div class="flex space-x-3">
          <div>
            <div class="form-control min-w-[300px] w-full max-w-xs">
              <label class="label">
                <span class="label-text">Pick the item you want</span>
              </label>
              <select v-model="itemId" class="select select-bordered">
                <option v-for="item in foodItems" :key="item.cost" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">Amount</span>
            </label>
            <input v-model="itemAmount" type="number" placeholder="Type here" class="input input-bordered w-full max-w-xs">
          </div>
        </div>
        <div v-if="selectedItem" class="text-md font-semibold text-center p-5">
          <p>{{ itemAmount }} {{ selectedItem.name }} Each Cost {{ selectedItem.cost }}Tk, Total = {{ itemAmount * selectedItem.cost }}Tk</p>
        </div>
        <div class="modal-action">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn btn-error" @click.prevent="$emit('closeModal')">
            Close
          </button>
          <button class="btn btn-primary" @click.prevent="addNedItem">
            Add
          </button>
        </div>
      </form>
    </dialog>
  </div>
</template>
