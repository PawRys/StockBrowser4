import { ref, computed, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useStocksStore } from '@/stores/stocksStore'

export const usePageStore = defineStore(
  'SB4_pageStore',
  () => {
    const stocksStore = useStocksStore()
    const { products } = storeToRefs(stocksStore)

    const currentPageNo = ref(1)
    const pageSize = ref(10)
    const pageCount = computed(() => Math.ceil(products.value.length / pageSize.value))
    const firstItemOnPage = computed(() => currentPageNo.value * pageSize.value - pageSize.value)
    const nextPage = () => {
      if (currentPageNo.value < pageCount.value) {
        currentPageNo.value++
      }
    }
    const prevPage = () => {
      if (currentPageNo.value > 1) {
        currentPageNo.value--
      }
    }
    const setCurrentPage = (event: Event) => {
      const target = event.target as HTMLSelectElement
      currentPageNo.value = Number(target.value)
    }
    const setPageSize = (event: Event) => {
      const target = event.target as HTMLSelectElement
      pageSize.value = Number(target.value)
    }
    watch([products, pageSize], () => {
      if (currentPageNo.value > pageCount.value) {
        currentPageNo.value = pageCount.value
      }
    })

    return {
      currentPageNo,
      pageSize,
      pageCount,
      firstItemOnPage,
      nextPage,
      prevPage,
      setCurrentPage,
      setPageSize
    }
  },
  {
    persist: {
      paths: ['pageSize']
    }
  }
)
