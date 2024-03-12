import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useFilterStore } from '@/stores/filterStore'
import { useSortingStore } from '@/stores/sortingStore'
import { calcPrice, calcQuant } from '../components/Utils/functions'
// const filterStore = useFilterStore()
// const sortingStore = useSortingStore()

function applyStatusFilter(el: Plywood) {
  const filterStore = useFilterStore()
  return el.stockStatus >= filterStore.status_filter
}

function applyTextFilter(el: Plywood) {
  const filterStore = useFilterStore()
  return `${el.id} ${el.name}`.match(new RegExp(filterStore.text_filter, 'gi'))
}

function applyTagFilter(plywood: Plywood) {
  const filterStore = useFilterStore()
  const filter = filterStore.tag_filter
  let matchFound = 0
  const filterCategories = Object.keys(filter)
  for (const key of filterCategories) {
    const k = key as keyof typeof filter
    const selectedAttribute = JSON.parse(JSON.stringify(filter[k]))
    const plywoodAttribute = plywood.attr[k].split(' ')
    const attributesSet = [...new Set([...selectedAttribute, ...plywoodAttribute])]
    if (selectedAttribute.length + plywoodAttribute.length > attributesSet.length) {
      matchFound++
    }
  }
  return filterCategories.length === matchFound ? true : false
}

function applySorting(a: Plywood, b: Plywood) {
  const sortingStore = useSortingStore()
  const sortColumn = sortingStore.sortColumn as keyof Plywood
  const aValue = a[sortColumn] as string
  const bValue = b[sortColumn] as string
  const sortUnit = sortingStore.sortUnit
  const collator = new Intl.Collator(undefined, {
    usage: 'sort',
    numeric: true
  })

  let lo = aValue
  let hi = bValue
  if (sortColumn.match(/price/i)) {
    lo = calcPrice(a.size, Number(aValue), sortUnit, 'm3').toString()
    hi = calcPrice(b.size, Number(bValue), sortUnit, 'm3').toString()
  }
  if (sortColumn.match(/Stock/i)) {
    lo = calcQuant(a.size, Number(aValue), sortUnit, 'm3').toString()
    hi = calcQuant(b.size, Number(bValue), sortUnit, 'm3').toString()
  }
  if (sortingStore.sortDir !== 1) return collator.compare(lo, hi)
  if (sortingStore.sortDir === 1) return collator.compare(hi, lo)
  return 0
}

export const useStocksStore = defineStore(
  'SB4_stocksStore',
  () => {
    const products = computed(() => {
      const ls = localStorage.SB4_products ? localStorage.SB4_products : []
      const result = JSON.parse(ls)
        .filter((el: Plywood) => applyStatusFilter(el))
        .filter((el: Plywood) => applyTagFilter(el))
        .filter((el: Plywood) => applyTextFilter(el))
        .sort((a: Plywood, b: Plywood) => applySorting(a, b))

      return result
    })

    function saveProducts(data: unknown) {
      localStorage.SB4_products = JSON.stringify(data)
    }

    return { products, saveProducts }
  },
  { persist: false }
)
