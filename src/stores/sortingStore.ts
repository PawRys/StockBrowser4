import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSortingStore = defineStore(
  'SB4_sortingStore',
  () => {
    const sortDir = ref(0)
    const sortUnit = ref('m3')
    const sortColumn = ref('id')
    watch(
      [sortUnit, sortColumn],
      () => {
        sortDir.value = 0
        console.log(sortColumn.value)
      },
      { immediate: true }
    )
    watch(sortDir, () => console.log(sortDir.value), { immediate: true })

    return { sortUnit, sortDir, sortColumn }
  },
  { persist: false }
)
