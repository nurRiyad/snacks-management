import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getCurrentUser, useFirestore } from 'vuefire'
import { collection, doc, getDoc, query } from '@firebase/firestore'
import { getDocs, setDoc, updateDoc } from 'firebase/firestore'

interface Order {
  name: string
  id: string
  cost: number
  amount: number
}

interface User {
  name: string
  id: string
  snacks_enabled: boolean
  floor: number
}

export const useSnacksStore = defineStore('snacks', () => {
  const loginUser = ref<User>()
  const orders = ref<Array<Order>>([])
  const isUserDataFetching = ref(false)
  const isOrdersDataFetching = ref(false)

  async function getUser() {
    isUserDataFetching.value = true

    const db = useFirestore()
    const user = await getCurrentUser()

    const url = `/users/${user?.uid}`

    const docRef = doc(db, url)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      loginUser.value = data as User
    }
    else {
      // eslint-disable-next-line no-console
      console.log('No such document!')
    }
    isUserDataFetching.value = false
  }

  async function setUser(username: string, floor: number) {
    const db = useFirestore()
    const user = await getCurrentUser()

    const url = `/users/${user?.uid}`

    const docRef = doc(db, url)

    const payload: User = {
      name: username,
      floor,
      id: user?.uid || '',
      snacks_enabled: false,
    }
    await setDoc(docRef, payload, { merge: true })

    await getUser()
  }

  async function updateSnakesOptions(payload: boolean) {
    isUserDataFetching.value = true

    const db = useFirestore()
    const user = await getCurrentUser()

    const url = `/users/${user?.uid}`

    const docRef = doc(db, url)

    // Set the "capital" field of the city 'DC'
    await updateDoc(docRef, {
      snacks_enabled: payload,
    })

    await getUser()
  }

  async function getOrders() {
    isOrdersDataFetching.value = true

    const db = useFirestore()
    const user = await getCurrentUser()

    const url = `/users/${user?.uid}/snacks`

    const q = query(collection(db, url))

    const querySnapshot = await getDocs(q)
    const allData: Array<Order> = []
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const data = doc.data() as Order
      if (data)
        allData.push(data)
    })

    orders.value = allData

    isOrdersDataFetching.value = false
  }

  function resetStore() {
    loginUser.value = undefined
    orders.value = []
  }

  return { loginUser, getUser, orders, getOrders, updateSnakesOptions, resetStore, setUser }
})
