<script setup lang="ts">
// import { ref, computed } from 'vue'
import { usePageStore } from '@/stores/paginationStore'
import { useFilterStore } from '@/stores/filterStore'
import { useStocksStore } from '@/stores/stocksStore'
import Pagination from '../ProductsList/ProductPagination.vue'

const pageStore = usePageStore()
const filterStore = useFilterStore()
const stocksStore = useStocksStore()
</script>

<template>
  <section id="products-list">
    <h2>Products</h2>
    <h3>List length: {{ stocksStore.products.length }}</h3>
    <input type="search" v-model="filterStore.filter" />
    <h3>{{ filterStore.filter }}</h3>
    <hr />
    <Pagination />
    <ul>
      <li
        v-for="(product, i) in stocksStore.products.slice(
          pageStore.currentPageFactor,
          pageStore.currentPageFactor + pageStore.pageSize
        )"
        :key="product.id"
      >
        {{ i + 1 + pageStore.currentPageFactor }}: {{ product.id }} : {{ product.name }}
      </li>
    </ul>
    <Pagination />
  </section>
</template>

<style scoped></style>
