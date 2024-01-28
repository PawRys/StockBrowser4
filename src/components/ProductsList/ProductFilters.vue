<script setup lang="ts">
import { watch, reactive } from 'vue'
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

const tags = reactive({
  sizeT_tags: new Set(),
  sizeA_tags: new Set(),
  sizeB_tags: new Set(),
  color_tags: new Set(),
  faceType_tags: new Set(),
  footSize_tags: new Set(),
  glueType_tags: new Set(),
  woodType_tags: new Set()
})

watch(
  products,
  () => {
    tags.sizeT_tags.clear()
    tags.sizeA_tags.clear()
    tags.sizeB_tags.clear()
    tags.color_tags.clear()
    tags.faceType_tags.clear()
    tags.footSize_tags.clear()
    tags.glueType_tags.clear()
    tags.woodType_tags.clear()

    products.value.forEach((el: Plywood) => {
      sizeT_tags.add(el.attr?.sizeT as string)
      sizeA_tags.add(el.attr?.sizeA as string)
      sizeB_tags.add(el.attr?.sizeB as string)
      faceType_tags.add(el.attr?.faceType as string)
      footSize_tags.add(el.attr?.footSize as string)
      glueType_tags.add(el.attr?.glueType as string)
      el.attr?.color?.split(' ').map((el) => color_tags.add(el))
      el.attr?.woodType?.split(' ').map((el) => woodType_tags.add(el))
    })
  },
  { immediate: true }
)

function applyFilters(e: Event) {
  const formElement = e.target as HTMLFormElement
  const formData = new FormData(formElement)

  filterStore.tag_filter = Object.fromEntries(
    Array.from(formData.keys()).map((key) => [key, formData.getAll(key)])
  )
  console.log(filterStore.tag_filter)
}
</script>

<template>
  <div class="product-filters">
    <h2>Filtry</h2>
    <div>{{ products.length }}</div>
    <input type="search" v-model="filterStore.text_filter" />
    <h3>{{ filterStore.text_filter }}</h3>
    <form id="tag-list" @submit.prevent="applyFilters" @reset="applyFilters">
      <input type="submit" value="Filtruj" />
      <input type="reset" value="Reset" />
      <div class="display-columns">
        <fieldset>
          <h4>Lico</h4>
          <template
            v-for="item of tags.faceType_tags.sort(collator.compare)"
            :key="`faceType-${escapeNonWordChars(item)}`"
          >
            <label :for="`faceType-${escapeNonWordChars(item)}`">
              <input
                :value="item"
                type="checkbox"
                name="faceType"
                :id="`faceType-${escapeNonWordChars(item)}`"
              />
              {{ item }}
            </label>
          </template>
        </fieldset>

        <!--
        <fieldset>
          <h4>Kolor</h4>
          <template
            v-for="item of Array.from(color_tags).sort(collator.compare)"
            :key="`color-${escapeNonWordChars(item)}`"
          >
            <label :for="`color-${escapeNonWordChars(item)}`">
              <input
                :value="item"
                type="checkbox"
                name="color"
                :id="`color-${escapeNonWordChars(item)}`"
              />
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
              <input
                :value="item"
                type="checkbox"
                name="sizeT"
                :id="`sizeT-${escapeNonWordChars(item)}`"
              />
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
              <input
                :value="item"
                type="checkbox"
                name="footSize"
                :id="`footSize-${escapeNonWordChars(item)}`"
              />
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
              <input
                :value="item"
                type="checkbox"
                name="sizeA"
                :id="`sizeA-${escapeNonWordChars(item)}`"
              />
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
              <input
                :value="item"
                type="checkbox"
                name="sizeB"
                :id="`sizeB-${escapeNonWordChars(item)}`"
              />
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
              <input
                :value="item"
                type="checkbox"
                name="woodType"
                :id="`woodType-${escapeNonWordChars(item)}`"
              />
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
              <input
                :value="item"
                type="checkbox"
                name="glueType"
                :id="`glueType-${escapeNonWordChars(item)}`"
              />
              {{ item }}
            </label>
          </template>
        </fieldset>
      --></div>
    </form>
  </div>
</template>

<style scoped>
.display-columns {
  display: flex;
}

label {
  display: flex;
  align-items: center;
  gap: 1ch;
}
</style>
