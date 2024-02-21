import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSortingStore = defineStore(
  'SB4_sortingStore',
  () => {
    const sortDir = ref(0)
    const sortUnit = 'm3'
    const sortColumn = ref('id')
    watch(sortColumn, () => (sortDir.value = 0))

    return { sortUnit, sortDir, sortColumn }
  },
  { persist: false }
)
