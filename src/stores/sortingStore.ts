import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSortingStore = defineStore(
  'SB4_sortingStore',
  () => {
    const sortDir = ref(0)
    const sortUnit = ref('')
    const sortColumn = ref<string>('id')
    watch([sortUnit, sortColumn], () => (sortDir.value = 0))

    return { sortUnit, sortDir, sortColumn }
  },
  { persist: false }
)
