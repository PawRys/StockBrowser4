<script setup lang="ts">
import { watch } from 'vue'
import { useFilterStore } from '@/stores/filterStore'
import { useStocksStore } from '@/stores/stocksStore'
import { storeToRefs } from 'pinia'
import { escapeNonWordChars } from '../Utils/functions'

const filterStore = useFilterStore()
const stocksStore = useStocksStore()
const { products } = storeToRefs(stocksStore)

const collator = new Intl.Collator(undefined, {
  usage: 'sort',
  numeric: true
})

const sizeT_tags: Set<string> = new Set()
const sizeA_tags: Set<string> = new Set()
const sizeB_tags: Set<string> = new Set()
const color_tags: Set<string> = new Set()
const faceType_tags: Set<string> = new Set()
const footSize_tags: Set<string> = new Set()
const glueType_tags: Set<string> = new Set()
const woodType_tags: Set<string> = new Set()

watch(
  products,
  () => {
    sizeT_tags.clear()
    sizeA_tags.clear()
    sizeB_tags.clear()
    color_tags.clear()
    faceType_tags.clear()
    footSize_tags.clear()
    glueType_tags.clear()
    woodType_tags.clear()

    products.value.forEach((el: Plywood) => {
      sizeT_tags.add(el.attr?.sizeT as string)
      sizeA_tags.add(el.attr?.sizeA as string)
      sizeB_tags.add(el.attr?.sizeB as string)
      el.attr?.color?.split(' ').map((el) => color_tags.add(el))
      faceType_tags.add(el.attr?.faceType as string)
      footSize_tags.add(el.attr?.footSize as string)
      glueType_tags.add(el.attr?.glueType as string)
      el.attr?.woodType?.split(' ').map((el) => woodType_tags.add(el))
    })

    console.log([
      Array.from(sizeT_tags).sort(collator.compare),
      Array.from(sizeA_tags).sort(collator.compare),
      Array.from(sizeB_tags).sort(collator.compare),
      Array.from(color_tags).sort(collator.compare),
      Array.from(faceType_tags).sort(collator.compare),
      Array.from(footSize_tags).sort(collator.compare),
      Array.from(glueType_tags).sort(collator.compare),
      Array.from(woodType_tags).sort(collator.compare)
    ])
  },
  { immediate: true }
)
</script>

<template>
  <div class="product-filters">
    <h2>Filtry</h2>
    <input type="search" v-model="filterStore.filter" />
    <h3>{{ filterStore.filter }}</h3>
    <form id="tag-list">
      <fieldset>
        <h4>Lico</h4>
        <template
          v-for="item of Array.from(faceType_tags).sort(collator.compare)"
          :key="`faceType-${escapeNonWordChars(item)}`"
        >
          <label :for="`faceType-${escapeNonWordChars(item)}`">
            <input type="checkbox" name="faceType" :id="`faceType-${escapeNonWordChars(item)}`" />
            {{ item }}
          </label>
        </template>
      </fieldset>

      <fieldset>
        <h4>Kolor</h4>
        <template
          v-for="item of Array.from(color_tags).sort(collator.compare)"
          :key="`color-${escapeNonWordChars(item)}`"
        >
          <label :for="`color-${escapeNonWordChars(item)}`">
            <input type="checkbox" name="color" :id="`color-${escapeNonWordChars(item)}`" />
            {{ item }}
          </label>
        </template>
      </fieldset>

      <fieldset>
        <h4>Grubość</h4>
        <template
          v-for="item of Array.from(sizeT_tags).sort(collator.compare)"
          :key="`sizeT-${escapeNonWordChars(item)}`"
        >
          <label :for="`sizeT-${escapeNonWordChars(item)}`">
            <input type="checkbox" name="sizeT" :id="`sizeT-${escapeNonWordChars(item)}`" />
            {{ item }}
          </label>
        </template>
      </fieldset>

      <fieldset>
        <h4>Rozmiar</h4>
        <template
          v-for="item of Array.from(footSize_tags).sort(collator.compare)"
          :key="`footSize-${escapeNonWordChars(item)}`"
        >
          <label :for="`footSize-${escapeNonWordChars(item)}`">
            <input type="checkbox" name="footSize" :id="`footSize-${escapeNonWordChars(item)}`" />
            {{ item }}
          </label>
        </template>
      </fieldset>

      <fieldset>
        <h4>Wym A</h4>
        <template
          v-for="item of Array.from(sizeA_tags).sort(collator.compare)"
          :key="`sizeA-${escapeNonWordChars(item)}`"
        >
          <label :for="`sizeA-${escapeNonWordChars(item)}`">
            <input type="checkbox" name="sizeA" :id="`sizeA-${escapeNonWordChars(item)}`" />
            {{ item }}
          </label>
        </template>
      </fieldset>

      <fieldset>
        <h4>Wym B</h4>
        <template
          v-for="item of Array.from(sizeB_tags).sort(collator.compare)"
          :key="`sizeB-${escapeNonWordChars(item)}`"
        >
          <label :for="`sizeB-${escapeNonWordChars(item)}`">
            <input type="checkbox" name="sizeB" :id="`sizeB-${escapeNonWordChars(item)}`" />
            {{ item }}
          </label>
        </template>
      </fieldset>

      <fieldset>
        <h4>Gatunek</h4>
        <template
          v-for="item of Array.from(woodType_tags).sort(collator.compare)"
          :key="`woodType-${escapeNonWordChars(item)}`"
        >
          <label :for="`woodType-${escapeNonWordChars(item)}`">
            <input type="checkbox" name="woodType" :id="`woodType-${escapeNonWordChars(item)}`" />
            {{ item }}
          </label>
        </template>
      </fieldset>

      <fieldset>
        <h4>Klej</h4>
        <template
          v-for="item of Array.from(glueType_tags).sort(collator.compare)"
          :key="`glueType-${escapeNonWordChars(item)}`"
        >
          <label :for="`glueType-${escapeNonWordChars(item)}`">
            <input type="checkbox" name="glueType" :id="`glueType-${escapeNonWordChars(item)}`" />
            {{ item }}
          </label>
        </template>
      </fieldset>
    </form>
  </div>
</template>

<style scoped>
#tag-list {
  display: flex;
}

label {
  display: flex;
  align-items: center;
  gap: 1ch;
}
</style>
