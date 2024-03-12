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

function applyTagFilter(el: Plywood) {
  const filterStore = useFilterStore()
  let count = 0
  const tagFilterKeys = Object.keys(filterStore.tag_filter)
  for (const key of tagFilterKeys) {
    const k = key as keyof typeof filterStore.tag_filter
    const tagFilterProxy = filterStore.tag_filter[k]
    const tagFilterArr = JSON.parse(JSON.stringify(tagFilterProxy))
    const plywoodAttrArr = el.attr[k].split(' ')
    const set = [...new Set([...tagFilterArr, ...plywoodAttrArr])]
    if (tagFilterArr.length + plywoodAttrArr.length > set.length) {
      count++
    }
  }
  return count == tagFilterKeys.length ? true : false
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
