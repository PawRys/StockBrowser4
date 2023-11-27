import { computed } from 'vue'
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

    return { products }
  },
  { persist: false }
)
