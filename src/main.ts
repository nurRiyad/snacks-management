import './assets/main.css'

// main.ts
import 'virtual:uno.css'

import { VueFire, VueFireAuth } from 'vuefire'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { firebaseApp } from './firebase'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(VueFire, {
  // imported above but could also just be created here
  firebaseApp,
  modules: [
    // we will see other modules later on
    VueFireAuth(),
  ],
})

app.mount('#app')
