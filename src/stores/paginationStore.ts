import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useStocksStore } from '@/stores/stocksStore'

export const usePageStore = defineStore(
  'SB4_product-page',
  () => {
    const stocksStore = useStocksStore()
    const page = ref(1)
    const pageSize = ref(10)

    // const pageCount = computed(() => Math.ceil(stocksStore.products.lenght / pageSize.value))
    const pageCount = computed(() => console.log(stocksStore.products, stocksStore.products.lenght))

    const nextPage = () => pageCount.value
    const prevPage = () => (page.value > 1 ? page.value-- : 1)
    const multiplier = computed(() => page.value * pageSize.value - pageSize.value)

    const setPage = () => false // tbd
    const setPageSize = () => false //tbd

    return { page, pageSize, nextPage, prevPage, multiplier, setPage, setPageSize }
  },
  { persist: false }
)
