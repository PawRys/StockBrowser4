import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCurrentTabStore = defineStore(
  'currentTab',
  () => {
    const tabId = ref(0)
    return { tabId }
  },
  { persist: true }
)
