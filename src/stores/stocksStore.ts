import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useFilterStore } from '@/stores/filterStore'
import { useSortingStore } from '@/stores/sortingStore'
import { calcPrice, calcQuant } from '../components/Utils/functions'

const localStorageProductsRef = ref(localStorage.SB4_products ? localStorage.SB4_products : '[]')

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
  type SortingColumnsNames = Pick<
    Plywood,
    'id' | 'name' | 'size' | 'price' | 'totalStock' | 'aviableStock' | 'stockStatus'
  >

  const sortingStore = useSortingStore()
  const columnName = sortingStore.sortColumn as keyof SortingColumnsNames
  const aValue = a[columnName] ?? ''
  const bValue = b[columnName] ?? ''
  const sortUnit = sortingStore.sortUnit
  const collator = new Intl.Collator(undefined, {
    usage: 'sort',
    numeric: true
  })

  let lo = aValue
  let hi = bValue
  if (columnName.match(/price/i)) {
    lo = calcPrice(a.size, Number(aValue), sortUnit, 'm3')
    hi = calcPrice(b.size, Number(bValue), sortUnit, 'm3')
  }
  if (columnName.match(/Stock/i)) {
    lo = calcQuant(a.size, Number(aValue), sortUnit, 'm3')
    hi = calcQuant(b.size, Number(bValue), sortUnit, 'm3')
  }
  if (sortingStore.sortDir > 0) return collator.compare(lo.toString(), hi.toString())
  if (sortingStore.sortDir < 0) return collator.compare(hi.toString(), lo.toString())
  return 0
}

export const useStocksStore = defineStore(
  'SB4_stocksStore',
  () => {
    const products = computed(() => {
      return JSON.parse(localStorageProductsRef.value)
        .filter((el: Plywood) => applyStatusFilter(el))
        .filter((el: Plywood) => applyTagFilter(el))
        .filter((el: Plywood) => applyTextFilter(el))
        .sort((a: Plywood, b: Plywood) => applySorting(a, b))
    })

    function saveProducts(data: Plywood[]) {
      localStorage.SB4_products = JSON.stringify(data)
      localStorageProductsRef.value = JSON.stringify(data)
    }

    return { products, saveProducts }
  },
  { persist: false }
)
