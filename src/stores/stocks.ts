import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useStocks = defineStore(
  'stocks_store_v4',
  () => {
    const products = ref<Plywood[]>([])

    return { products }
  },
  { persist: true }
)
