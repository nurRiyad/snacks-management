import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getCurrentUser, useFirestore } from 'vuefire'
import { collection, doc, getDoc, query } from '@firebase/firestore'
import { getDocs, setDoc, updateDoc, where } from 'firebase/firestore'

interface Order {
  name: string
  id: string
  cost: number
  amount: number
  uid: string
}

interface User {
  name: string
  id: string
  snacks_enabled: boolean
  floor: number
  orders?: Array<Order>
}

export const useSnacksStore = defineStore('snacks', () => {
  const loginUser = ref<User>()
  const snacksEnabledUsers = ref<Array<User>>([])
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
        allData.push({ ...data, uid: doc.id })
    })

    orders.value = allData

    isOrdersDataFetching.value = false
  }

  async function getSnacksEnableUser() {
    isOrdersDataFetching.value = true

    const db = useFirestore()
    // const user = await getCurrentUser()

    const url1 = '/users'

    const q = query(collection(db, url1), where('snacks_enabled', '==', true))

    const querySnapshot = await getDocs(q)
    const allUsers: Array<User> = []
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const data = doc.data() as User
      if (data)
        allUsers.push({ ...data })
    })

    await Promise.all(allUsers.map(async (usr) => {
      const url2 = `/users/${usr.id}/snacks`

      const qy = query(collection(db, url2))

      const qSnapshot = await getDocs(qy)
      const allOrders: Array<Order> = []
      qSnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
        const data = doc.data() as Order
        if (data)
          allOrders.push({ ...data, uid: doc.id })
      })

      usr.orders = allOrders
    }))

    snacksEnabledUsers.value = allUsers

    isOrdersDataFetching.value = false
  }

  function resetStore() {
    loginUser.value = undefined
    orders.value = []
  }

  return {
    orders,
    loginUser,
    snacksEnabledUsers,

    getUser,
    setUser,
    getOrders,
    resetStore,
    updateSnakesOptions,
    getSnacksEnableUser,
  }
})
