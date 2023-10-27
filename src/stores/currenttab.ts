import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCurrentTabStore = defineStore(
  'SB4_currentTab',
  () => {
    const tabId = ref(0)
    return { tabId }
  },
  { persist: true }
)
