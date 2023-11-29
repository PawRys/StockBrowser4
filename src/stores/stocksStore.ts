import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useFilterStore } from '@/stores/filterStore'

export const useStocksStore = defineStore(
  'SB4_stocksStore',
  () => {
    const filterStore = useFilterStore()
    const products = computed(() => {
      if (!localStorage.SB4_products) return []
      return JSON.parse(localStorage.SB4_products).filter((el: Plywood) =>
        `${el.id} ${el.name}`.match(new RegExp(filterStore.filter, 'gi'))
      )
    })

    const test = ref(localStorage.SB4_products || [])

    function saveProducts(data: unknown) {
      console.log(data)
      /**  */
    }

    return { test, products, saveProducts }
  },
  { persist: false }
)
