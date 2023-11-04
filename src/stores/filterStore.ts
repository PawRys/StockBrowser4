import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useFilterStore = defineStore(
  'SB4_filterStore',
  () => {
    const filter = ref('')

    return { filter }
  },
  { persist: false }
)
