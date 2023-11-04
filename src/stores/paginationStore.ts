import { ref, computed, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useStocksStore } from '@/stores/stocksStore'

export const usePageStore = defineStore(
  'SB4_pageStore',
  () => {
    const stocksStore = useStocksStore()
    const { products } = storeToRefs(stocksStore)

    const currentPage = ref(1)
    const pageSize = ref(10)
    const pageCount = computed(() => Math.ceil(products.value.length / pageSize.value))
    const currentPageFactor = computed(() => currentPage.value * pageSize.value - pageSize.value)
    const nextPage = () => {
      if (currentPage.value < pageCount.value) {
        currentPage.value++
      }
    }
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }
    const setCurrentPage = (event: Event) => {
      const target = event.target as HTMLSelectElement
      currentPage.value = Number(target.value)
    }
    const setPageSize = (event: Event) => {
      const target = event.target as HTMLSelectElement
      pageSize.value = Number(target.value)
    }
    watch([products, pageSize], () => {
      if (currentPage.value > pageCount.value) {
        currentPage.value = pageCount.value
      }
    })

    return {
      currentPage,
      pageSize,
      pageCount,
      currentPageFactor,
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
