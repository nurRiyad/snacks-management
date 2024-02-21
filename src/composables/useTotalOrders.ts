import { storeToRefs } from 'pinia'
import { useSnacksStore } from '@/stores/counter'
import { foodItems } from '@/utils/foodItem'

export function useTotalOrders() {
  const snacksStore = useSnacksStore()

  const { snacksEnabledUsers } = storeToRefs(snacksStore)

  function calculateTotalAmount(foodId: string, floorId: number) {
    let count = 0
    snacksEnabledUsers.value.forEach((usr) => {
      if (usr.floor === floorId) {
        usr.orders?.forEach((ord) => {
          if (ord.id === foodId && ord.is_item_enabled)
            count += ord.amount
        })
      }
    })

    return count
  }

  function generatedOrders(floorId: number) {
    const allOrders = foodItems.map((food) => {
      const ttlAmount = calculateTotalAmount(food.id, floorId)
      const ttlCost = ttlAmount * food.cost
      return {
        name: food.name,
        cost: food.cost,
        id: food.id,
        amount: ttlAmount,
        total: ttlCost,
      }
    }) || []

    return allOrders.filter((odr) => {
      return odr.total !== 0
    }) || []
  }

  function overallAmount(floorId: number) {
    const allData = generatedOrders(floorId)
    let cost = 0

    allData.forEach((data) => {
      cost += data.total
    })

    return cost
  }

  return {
    generatedOrders,
    overallAmount,
  }
}
