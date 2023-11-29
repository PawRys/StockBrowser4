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

    // const test = ref(JSON.parse(localStorage.SB4_products || '[]'))
    const test2 = ref(localStorage.SB4_products)

    function saveProducts(data: unknown) {
      localStorage.SB4_products = JSON.stringify(data)
      test2.value = JSON.stringify(data)
    }

    return { test2, products, saveProducts }
  },
  { persist: false }
)
