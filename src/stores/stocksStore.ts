import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useFilterStore } from '@/stores/filterStore'

export const useStocksStore = defineStore(
  'SB4_stocksStore',
  () => {
    const filterStore = useFilterStore()
    const products = computed(() => {
      if (!localStorage.SB4_products) return []
      return JSON.parse(localStorage.SB4_products)
        .filter((el: Plywood) => el.stock_status >= 1)
        .filter((el: Plywood) => {
          let count = 0
          const tagFilterKeys = Object.keys(filterStore.tag_filter)
          for (const key of tagFilterKeys) {
            const tagFilterProxy =
              filterStore.tag_filter[key as keyof typeof filterStore.tag_filter]
            const tagFilterArr = JSON.parse(JSON.stringify(tagFilterProxy))
            const plywoodAttrArr = el.attr[key as keyof typeof filterStore.tag_filter].split(' ')
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
