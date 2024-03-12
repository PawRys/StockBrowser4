import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSortingStore = defineStore(
  'SB4_sortingStore',
  () => {
    const sortDir = ref(1)
    const sortUnit = ref('')
    const sortColumn = ref<string>('id')
    watch([sortUnit, sortColumn], () => (sortDir.value = 1))

    return { sortDir, sortUnit, sortColumn }
  },
  { persist: false }
)
