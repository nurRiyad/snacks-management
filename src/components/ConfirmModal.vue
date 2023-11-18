<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  showModal: boolean
  isLoading: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showModal: false,
  isLoading: false,
})

const emits = defineEmits(['closeModal', 'confirmModal'])

const confirm_modal = ref<HTMLDialogElement | null>(null)

watch(() => props.showModal, (n) => {
  if (n) {
    confirm_modal.value?.showModal()
  }
  else {
    emits('closeModal')
    confirm_modal.value?.close()
  }
}, { immediate: true })
</script>

<template>
  <div @keydown.esc="$emit('closeModal')">
    <!-- Open the modal using ID.showModal() method -->
    <dialog id="confirm_modal" ref="confirm_modal" class="modal">
      <form method="dialog" class="modal-box">
        <h3 class="font-bold text-xl py-3">
          Oder Confirmation Modal
        </h3>
        <div class="flex space-x-3">
          <p>Are you sure, you wanna place order ? </p>
        </div>

        <div class="modal-action">
          <!-- if there is a button in form, it will close the modal -->
          <button v-if="!isLoading" class="btn btn-error" @click.prevent="$emit('closeModal')">
            No
          </button>
          <button class="btn btn-primary" :class="{ loading: isLoading }" @click.prevent="$emit('confirmModal')">
            Yes
          </button>
        </div>
      </form>
    </dialog>
  </div>
</template>
