import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export const useFilterStore = defineStore(
  'SB4_filterStore',
  () => {
    const filter = ref('')
    const tags = reactive({})

    return { filter, tags }
  },
  { persist: false }
)
