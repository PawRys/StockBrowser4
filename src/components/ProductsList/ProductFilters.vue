<script setup lang="ts">
import { watch } from 'vue'
import { useFilterStore } from '@/stores/filterStore'
import { useStocksStore } from '@/stores/stocksStore'
import { storeToRefs } from 'pinia'

const filterStore = useFilterStore()
const stocksStore = useStocksStore()
const { products } = storeToRefs(stocksStore)

const collator = new Intl.Collator(undefined, {
  usage: 'sort',
  numeric: true
})

watch(products, () => {
  // const tags: Set<string> = new Set()
  const sizeA_tags: Set<string> = new Set()
  const sizeB_tags: Set<string> = new Set()
  const sizeC_tags: Set<string> = new Set()
  const color_tags: Set<string> = new Set()
  const faceType_tags: Set<string> = new Set()
  const footSize_tags: Set<string> = new Set()
  const glueType_tags: Set<string> = new Set()
  const woodType_tags: Set<string> = new Set()

  products.value.forEach((el: Plywood) => {
    sizeA_tags.add(el.attr?.sizeA as string)
    sizeB_tags.add(el.attr?.sizeB as string)
    sizeC_tags.add(el.attr?.sizeC as string)
    color_tags.add(el.attr?.color as string)
    faceType_tags.add(el.attr?.faceType as string)
    footSize_tags.add(el.attr?.footSize as string)
    glueType_tags.add(el.attr?.glueType as string)
    woodType_tags.add(el.attr?.woodType as string)
  })

  // console.log(Array.from(tags).sort(collator.compare))

  console.log([
    Array.from(sizeA_tags).sort(collator.compare),
    Array.from(sizeB_tags).sort(collator.compare),
    Array.from(sizeC_tags).sort(collator.compare),
    Array.from(color_tags).sort(collator.compare),
    Array.from(faceType_tags).sort(collator.compare),
    Array.from(footSize_tags).sort(collator.compare),
    Array.from(glueType_tags).sort(collator.compare),
    Array.from(woodType_tags).sort(collator.compare)
  ])
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
