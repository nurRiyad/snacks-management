import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getCurrentUser, useFirestore } from 'vuefire'
import { collection, doc, getDoc, query } from '@firebase/firestore'
import { getDocs, setDoc, updateDoc, where } from 'firebase/firestore'

export interface Order {
  name: string
  id: string
  cost: number
  amount: number
  uid: string
  is_item_enabled: boolean
}

export interface User {
  name: string
  id: string
  snacks_enabled: boolean
  floor: number
  balance: number
  isAdmin?: boolean
  orders?: Array<Order>
  lastOrdered?: string
}

export const useSnacksStore = defineStore('snacks', () => {
  const loginUser = ref<User>()
  const selectedUser = ref<User>()
  const snacksEnabledUsers = ref<Array<User>>([])
  const allUsers = ref<Array<User>>([])
  const orders = ref<Array<Order>>([])

  const isUserDataFetching = ref(false)
  const isOrdersDataFetching = ref(false)

  async function getUser() {
    isUserDataFetching.value = true

    const db = useFirestore()
    const user = await getCurrentUser()

    const url = `/snacks-users/${user?.uid}`

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

    const url = `/snacks-users/${user?.uid}`

    const docRef = doc(db, url)

    const payload: User = {
      name: username,
      floor,
      id: user?.uid || '',
      snacks_enabled: false,
      balance: 0,
    }
    await setDoc(docRef, payload, { merge: true })

    await getUser()
  }

  async function updateSnakesOptions(payload: boolean) {
    isUserDataFetching.value = true

    const db = useFirestore()
    const user = await getCurrentUser()

    const url = `/snacks-users/${user?.uid}`

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

    const url = `/snacks-users/${user?.uid}/snacks`

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

  async function getOrdersForUserId(uid: string) {
    isOrdersDataFetching.value = true

    const db = useFirestore()

    const url = `/snacks-users/${uid}/snacks`

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

    const url1 = '/snacks-users'

    const q = query(collection(db, url1), where('snacks_enabled', '==', true))

    const querySnapshot = await getDocs(q)
    const allSnacksEnableUser: Array<User> = []
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const data = doc.data() as User
      if (data)
        allSnacksEnableUser.push({ ...data })
    })

    await Promise.all(allSnacksEnableUser.map(async (usr) => {
      const url2 = `/snacks-users/${usr.id}/snacks`

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

    snacksEnabledUsers.value = allSnacksEnableUser

    isOrdersDataFetching.value = false
  }

  async function getAllUser() {
    isOrdersDataFetching.value = true

    const db = useFirestore()
    // const user = await getCurrentUser()

    const url1 = '/snacks-users'

    const q = query(collection(db, url1))

    const querySnapshot = await getDocs(q)
    const allSnacksEnableUser: Array<User> = []
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const data = doc.data() as User
      if (data)
        allSnacksEnableUser.push({ ...data })
    })
    allUsers.value = allSnacksEnableUser

    isOrdersDataFetching.value = false
  }

  function resetStore() {
    loginUser.value = undefined
    orders.value = []
  }

  async function updateOrderEnabledStatus(uid: string, isEnabled: boolean, user_id?: string) {
    const db = useFirestore()
    const user = await getCurrentUser()
    let url
    if (user_id)
      url = `/snacks-users/${user_id}/snacks/${uid}`
    else
      url = `/snacks-users/${user?.uid}/snacks/${uid}`
    const docRef = doc(db, url)
    await updateDoc(docRef, {
      is_item_enabled: isEnabled,
    })
    await getOrders()
  }

  async function updateOrderAmount(uid: string, updatedAmount: number, user_id?: string) {
    const db = useFirestore()
    const user = await getCurrentUser()
    let url
    if (user_id)
      url = `/snacks-users/${user_id}/snacks/${uid}`
    else
      url = `/snacks-users/${user?.uid}/snacks/${uid}`
    const docRef = doc(db, url)
    await updateDoc(docRef, {
      amount: updatedAmount,
    })
    await getOrders()
  }

  async function getSelectedUser(uid: string) {
    isUserDataFetching.value = true
    const db = useFirestore()
    // Step 1: Retrieve user information
    const userUrl = `/snacks-users/${uid}`
    const userDocRef = doc(db, userUrl)
    const userDocSnap = await getDoc(userDocRef)
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data()
      selectedUser.value = userData as User
      // Step 2: Retrieve orders for the selected user
      const ordersUrl = `/snacks-users/${uid}/snacks`
      const ordersQuery = query(collection(db, ordersUrl))
      const ordersQuerySnapshot = await getDocs(ordersQuery)
      const userOrders: Array<Order> = []
      ordersQuerySnapshot.forEach((orderDoc) => {
        const orderData = orderDoc.data() as Order
        if (orderData)
          userOrders.push({ ...orderData, uid: orderDoc.id })
      })
      // Step 3: Assign user information and orders to selectedUser
      selectedUser.value.orders = userOrders
    }
    isUserDataFetching.value = false
  }
  return {
    orders,
    loginUser,
    allUsers,
    snacksEnabledUsers,
    selectedUser,
    isUserDataFetching,

    getUser,
    setUser,
    getAllUser,
    getOrders,
    resetStore,
    updateSnakesOptions,
    getSnacksEnableUser,
    updateOrderEnabledStatus,
    updateOrderAmount,
    getSelectedUser,
    getOrdersForUserId,
  }
})
