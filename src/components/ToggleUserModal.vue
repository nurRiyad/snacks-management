<script setup lang="ts">
import { ref, watch } from 'vue'
import { useFirestore } from 'vuefire'
import { storeToRefs } from 'pinia'
import { doc, updateDoc } from 'firebase/firestore'
import { useSnacksStore } from '@/stores/counter'

interface AllItems {
  name: string
  id: string
  snacks_enabled: boolean
  floor: number
  balance: number
  isAdmin?: boolean | undefined
  orders?: {
    name: string
    id: string
    cost: number
    amount: number
    uid: string
  }[] | undefined
}
interface Props {
  showModal: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showModal: false,
})

const emits = defineEmits(['closeModal'])

const snacksStore = useSnacksStore()

const my_modal_3 = ref<HTMLDialogElement | null>(null)

const isAdding = ref(false)

const { allUsers } = storeToRefs(snacksStore)

watch(() => props.showModal, (n) => {
  if (n) {
    my_modal_3.value?.showModal()
  }
  else {
    emits('closeModal')
    my_modal_3.value?.close()
  }
}, { immediate: true })

async function updateSnacksEnabled(item: AllItems) {
  try {
    const db = useFirestore()

    const url = `/snacks-users/${item.id}`

    const docRef = doc(db, url)

    await updateDoc(docRef, {
      snacks_enabled: item.snacks_enabled,
    })
    await snacksStore.getUser()
    await snacksStore.getSnacksEnableUser()
    await snacksStore.getAllUser()
  }
  catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div @keydown.esc="$emit('closeModal')">
    <dialog id="my_modal_3" ref="my_modal_3" class="modal">
      <form method="dialog" class="modal-box">
        <h3 class="font-bold text-xl py-3 border-b mb-4">
          Enable or Disable order
        </h3>
        <div class="flex space-x-3">
          <div class="form-control w-full">
            <div class="grid grid-cols-2">
              <div v-for="item in allUsers" :key="item.id" class="flex space-x-2 mb-4">
                <input v-model="item.snacks_enabled" type="checkbox" class="toggle toggle-primary" @change="updateSnacksEnabled(item)">
                <p class="font-semibold">
                  {{ item.name }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-action">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn btn-error" :disabled="isAdding" @click.prevent="$emit('closeModal')">
            Close
          </button>
        </div>
      </form>
    </dialog>
  </div>
</template>
