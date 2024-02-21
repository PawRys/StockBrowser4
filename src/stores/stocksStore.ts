import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useFilterStore } from '@/stores/filterStore'
import { useSortingStore } from '@/stores/sortingStore'
import { calcPrice, calcQuant } from '../components/Utils/functions'

const collator = new Intl.Collator(undefined, {
  usage: 'sort',
  numeric: true
})

export const useStocksStore = defineStore(
  'SB4_stocksStore',
  () => {
    const filterStore = useFilterStore()
    const sortingStore = useSortingStore()
    const products = computed(() => {
      if (!localStorage.SB4_products) return []
      return JSON.parse(localStorage.SB4_products)
        .filter((el: Plywood) => el.stockStatus >= filterStore.status_filter)
        .filter((el: Plywood) => {
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
        })
        .filter((el: Plywood) =>
          `${el.id} ${el.name}`.match(new RegExp(filterStore.text_filter, 'gi'))
        )
        .sort((a: any, b: any) => {
          const sortColumn = sortingStore.sortColumn
          const sortUnit = sortingStore.sortUnit

          let first = a[sortColumn]
          let last = b[sortColumn]

          if (sortColumn.match(/price/i)) {
            first = calcPrice(a.size, a[sortColumn], sortUnit, 'm3')
            last = calcPrice(b.size, b[sortColumn], sortUnit, 'm3')
          }
          if (sortColumn.match(/Stock/i)) {
            first = calcQuant(a.size, a[sortColumn], sortUnit, 'm3')
            last = calcQuant(b.size, b[sortColumn], sortUnit, 'm3')
          }
          if (sortingStore.sortDir !== 1) return collator.compare(first, last)
          if (sortingStore.sortDir === 1) return collator.compare(last, first)
        })
    })

    // watch(
    //   filterStore.tag_filter,
    //   () => {
    //     console.log(filterStore.tag_filter)
    //   },
    //   { immediate: true }
    // )

    // const jso = JSON.parse(localStorage.SB4_products || '[]')
    // const test2 = reactive(jso)
    /**
     * Saving string into localstorage is way more performant
     */
    const test2 = ref(localStorage.SB4_products)

    function saveProducts(data: unknown) {
      localStorage.SB4_products = JSON.stringify(data)
      // test2.value = data
      test2.value = JSON.stringify(data)
    }

    return { test2, products, saveProducts }
  },
  { persist: false }
)
