import { defineStore } from 'pinia'

export const useSortingStore = defineStore(
  'SB4_sortingStore',
  () => {
    const sortOrder = 'asc'
    const sortColumn = 'id'
    return { sortOrder, sortColumn }
  },
  { persist: false }
)
