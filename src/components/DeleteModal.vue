<script setup lang="ts">
import { deleteDoc, doc } from 'firebase/firestore'
import { ref, watch } from 'vue'
import { getCurrentUser, useFirestore } from 'vuefire'
import { useSnacksStore } from '@/stores/counter'

interface Props {
  showModal: boolean
  uid: string
}

const props = withDefaults(defineProps<Props>(), {
  showModal: false,
  uid: '-',
})

const emits = defineEmits(['closeModal'])

const snacksStore = useSnacksStore()

const my_modal_1 = ref<HTMLDialogElement | null>(null)
const isRemoving = ref(false)

watch(() => props.showModal, (n) => {
  if (n) {
    my_modal_1.value?.showModal()
  }
  else {
    emits('closeModal')
    my_modal_1.value?.close()
  }
}, { immediate: true })

async function deleteItem() {
  try {
    isRemoving.value = true

    const user = await getCurrentUser()
    const db = useFirestore()

    const url = `users/${user?.uid}/snacks/${props.uid}`

    await deleteDoc(doc(db, url))

    snacksStore.getOrders()

    emits('closeModal')
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }

  isRemoving.value = false
}
</script>

<template>
  <div @keydown.esc="$emit('closeModal')">
    <!-- Open the modal using ID.showModal() method -->
    <dialog id="my_modal_1" ref="my_modal_1" class="modal">
      <form method="dialog" class="modal-box">
        <h3 class="font-bold text-xl py-3">
          Delete This Item
        </h3>
        <div class="flex space-x-3">
          <p>Are you sure you wanna delete this order ? </p>
        </div>
        <div class="modal-action">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn btn-primary" @click.prevent="$emit('closeModal')">
            Close
          </button>
          <button class="btn btn-error" @click.prevent="deleteItem">
            Remove
          </button>
        </div>
      </form>
    </dialog>
  </div>
</template>
