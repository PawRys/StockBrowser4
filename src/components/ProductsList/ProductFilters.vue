<script setup lang="ts">
import { watch, ref } from 'vue'
import { useFilterStore } from '@/stores/filterStore'
import { useStocksStore } from '@/stores/stocksStore'
import { storeToRefs } from 'pinia'
import { escapeNonWordChars } from '../Utils/functions'

const refreshComponent = ref(0)
const filterStore = useFilterStore()
const stocksStore = useStocksStore()
const { products } = storeToRefs(stocksStore)

const collator = new Intl.Collator(undefined, {
  usage: 'sort',
  numeric: true
})

const tags = {
  sizeT: new Set() as Set<string>,
  sizeA: new Set() as Set<string>,
  sizeB: new Set() as Set<string>,
  color: new Set() as Set<string>,
  faceType: new Set() as Set<string>,
  footSize: new Set() as Set<string>,
  glueType: new Set() as Set<string>,
  woodType: new Set() as Set<string>
}

const tagsLabels = {
  faceType: 'Lico',
  color: 'Kolor',
  sizeT: 'Grubość',
  footSize: 'Rozmiar',
  sizeA: 'Wym A',
  sizeB: 'Wym B',
  woodType: 'Gatunek',
  glueType: 'Klej'
}

watch(
  products,
  () => {
    tags.sizeT.clear()
    tags.sizeA.clear()
    tags.sizeB.clear()
    tags.color.clear()
    tags.faceType.clear()
    tags.footSize.clear()
    tags.glueType.clear()
    tags.woodType.clear()

    products.value.forEach((el: Plywood) => {
      tags.sizeT.add(el.attr?.sizeT as string)
      tags.sizeA.add(el.attr?.sizeA as string)
      tags.sizeB.add(el.attr?.sizeB as string)
      tags.faceType.add(el.attr?.faceType as string)
      tags.footSize.add(el.attr?.footSize as string)
      tags.glueType.add(el.attr?.glueType as string)
      el.attr?.color?.split(' ').map((el) => tags.color.add(el))
      el.attr?.woodType?.split(' ').map((el) => tags.woodType.add(el))
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
}

function resetFilters(filterName: string) {
  if (filterName !== 'global') {
    delete filterStore.tag_filter[filterName as keyof typeof filterStore.tag_filter]
    refreshComponent.value++
  }
  if (filterName === 'global') {
    filterStore.tag_filter = {}
  }
}

function isChecked(filterName: string, filterValue: string) {
  const fn = filterName as keyof typeof filterStore.tag_filter
  const check = filterStore.tag_filter[fn]?.indexOf(filterValue) ?? -1
  return check >= 0 ? true : false
}
</script>

<template>
  <div class="product-filters" :key="refreshComponent">
    <h2>Filtry {{ products.length }}</h2>
    <input type="search" v-model="filterStore.text_filter" />
    <h3>{{ filterStore.text_filter }}</h3>
    <form id="tag-list" @submit.prevent="applyFilters">
      <input type="submit" value="Filtruj" />
      <input type="reset" value="Usuń wszystkie filtry" @click="resetFilters('global')" />

      <div class="display-columns">
        <fieldset v-for="(setLabel, setName) in tagsLabels" :key="`setKey-${setName}`">
          <h4>{{ setLabel }}</h4>

          <template
            v-for="item of Array.from(tags[setName]).sort(collator.compare)"
            :key="`${setName}-${escapeNonWordChars(item)}`"
          >
            <label :for="`${setName}-${escapeNonWordChars(item)}`">
              <input
                type="checkbox"
                :value="item"
                :name="setName"
                :checked="isChecked(setName, item)"
                :id="`${setName}-${escapeNonWordChars(item)}`"
              />
              {{ item }}
            </label>
          </template>

          <input type="submit" value="Filtruj" />
          <input type="reset" value="Usuń filtr" @click="resetFilters(setName)" />
        </fieldset>
      </div>
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
