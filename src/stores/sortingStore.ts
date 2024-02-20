import { defineStore } from 'pinia'

export const useSortingStore = defineStore(
  'SB4_sortingStore',
  () => {
    const sortUnit = 'm3'
    const sortOrder = 'asc'
    const sortColumn = 'id'
    return { sortUnit, sortOrder, sortColumn }
  },
  { persist: false }
)
