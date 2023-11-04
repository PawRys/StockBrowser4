<script setup lang="ts">
import { watch } from 'vue'
import { useFilterStore } from '@/stores/filterStore'
import { useStocksStore } from '@/stores/stocksStore'
import { storeToRefs } from 'pinia'

const filterStore = useFilterStore()
const stocksStore = useStocksStore()
const { products } = storeToRefs(stocksStore)

const collator = new Intl.Collator('kn')

watch(products, () => {
  const tags: Set<string> = new Set()
  products.value.forEach((el: Plywood) => {
    // tags.add(el.woodType)
    tags.add(el.faceType as string)
  })

  console.log(Array.from(tags).sort(collator.compare))
})
</script>

<template>
  <div class="product-filters">
    <h2>Filtry</h2>
    <input type="search" v-model="filterStore.filter" />
    <h3>{{ filterStore.filter }}</h3>
  </div>
</template>

<style scoped></style>
