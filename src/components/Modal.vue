<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  showModal: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showModal: false,
})

const event = defineEmits(['closeModal'])

const my_modal_1 = ref<HTMLDialogElement | null>(null)

watch(() => props.showModal, (n) => {
  if (n)
    my_modal_1.value?.showModal()
})

function OnEscClick() {
  event('closeModal')
}
</script>

<template>
  <div @keydown.esc="OnEscClick">
    <!-- Open the modal using ID.showModal() method -->
    <dialog id="my_modal_1" ref="my_modal_1" class="modal">
      <form method="dialog" class="modal-box">
        <h3 class="font-bold text-xl py-3">
          Add New Item
        </h3>
        <div class="flex space-x-3">
          <div>
            <div class="form-control w-full max-w-xs">
              <label class="label">
                <span class="label-text">Pick the item you want</span>
              </label>
              <select class="select select-bordered">
                <option>Star Wars</option>
                <option>Harry Potter</option>
                <option>Lord of the Rings</option>
                <option>Planet of the Apes</option>
                <option>Star Trek</option>
              </select>
            </div>
          </div>
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">Amount</span>
            </label>
            <input type="number" placeholder="Type here" class="input input-bordered w-full max-w-xs">
          </div>
        </div>
        <div class="text-md font-semibold text-center p-5">
          <p>20 Mugdal Each Cost 20Tk, Total = 400Tk</p>
        </div>
        <div class="modal-action">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn btn-error" @click="$emit('closeModal')">
            Close
          </button>
          <button class="btn btn-primary" @click="$emit('closeModal')">
            Add
          </button>
        </div>
      </form>
    </dialog>
  </div>
</template>
