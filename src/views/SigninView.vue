<script setup lang="ts">
import {
  GoogleAuthProvider,
  getAuth,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
} from 'firebase/auth'
import { useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import Info from '@/components/svg/Info.vue'
import Google from '@/components/svg/Google.vue'

const provider = new GoogleAuthProvider()

const auth = getAuth()
const router = useRouter()

const email = ref('')
const sentMail = ref(false)
const errorMsg = ref('')
const showProcessing = ref(false)

// For Local Dev -> url: 'http://localhost:5173/signin',
const actionCodeSettings = {
  url: 'https://ac-snacks.vercel.app/snacks',
  handleCodeInApp: true,
}

function googleSignIn() {
  signInWithPopup(auth, provider)
    .then(() => {
      router.push('/snacks')
    })
    .catch((error) => {
      const errorCode = error.code
      if (errorCode === 'auth/invalid-email')
        errorMsg.value = 'Invalid Email'
    })
}

function sentEmailForVerify() {
  if (email.value.length >= 5) {
    showProcessing.value = true
    sendSignInLinkToEmail(auth, email.value, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('emailForSignIn', email.value)
        sentMail.value = true
        showProcessing.value = false
      })
      .catch((error) => {
        showProcessing.value = false
        const errorCode = error.code
        if (errorCode === 'auth/invalid-email')
          errorMsg.value = 'Invalid Email'
      })
  }
}

// clean error msg when email change
watch(email, () => {
  errorMsg.value = ''
  sentMail.value = false
})

onMounted(() => {
  // Confirm the link is a sign-in with email link.
  if (isSignInWithEmailLink(auth, window.location.href)) {
    showProcessing.value = true

    let email = window.localStorage.getItem('emailForSignIn') || ''

    if (!email) {
      // eslint-disable-next-line no-alert
      email = window.prompt('Please provide your email for confirmation') || ''
    }
    signInWithEmailLink(auth, email, window.location.href)
      .then(() => {
        // Clear email from storage.
        showProcessing.value = false
        window.localStorage.removeItem('emailForSignIn')
        router.push('/snacks')
      })
      .catch((error) => {
        showProcessing.value = false
        const errorCode = error.code
        if (errorCode === 'auth/invalid-email')
          errorMsg.value = 'Invalid Email'
      })
  }
})
</script>

<template>
  <div class="container max-w-5xl h-full mx-auto">
    <div class="flex justify-center h-full items-center">
      <div class="flex flex-col space-y-4 p-10 m-5 rounded-lg shadow-md bg-base-100">
        <div>
          <h1 class="text-4xl text-center font-bold text-primary">
            Welcome !
          </h1>
          <p class="text-zinc-500 text-sm text-center pb-5 pt-2">
            Start Your Journey With Vuefire Todo
          </p>
        </div>
        <input
          v-model="email"
          type="email"
          placeholder="Enter Your Email"
          class="input input-bordered input-primary w-full max-w-xs"
        >
        <button
          class="btn btn-primary"
          :class="{ loading: showProcessing === true }"
          @click="sentEmailForVerify"
        >
          Sign In
        </button>

        <button
          class="btn btn-primary  gap-1"
          @click="googleSignIn"
        >
          <span class="pr-2">Sign In With</span>
          <Google class="w-4" />
        </button>
        <div v-if="sentMail" class="alert alert-info shadow-lg flex">
          <div class="flex space-x-2">
            <Info />
            <span>Check mailbox for logIn link</span>
          </div>
        </div>
        <div v-if="errorMsg.length > 1" class="alert alert-error shadow-lg">
          <div class="flex space-x-2">
            <Info />
            <span>{{ errorMsg }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
