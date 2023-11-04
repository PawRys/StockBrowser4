<script setup lang="ts">
// import { ref, computed } from 'vue'
import { usePageStore } from '@/stores/paginationStore'
import { useStocksStore } from '@/stores/stocksStore'
import Pagination from '../ProductsList/ProductPagination.vue'
import Filters from '../ProductsList/ProductFilters.vue'

const pageStore = usePageStore()
const stocksStore = useStocksStore()
</script>

<template>
  <section id="products-list">
    <h2>Products</h2>
    <h3>List length: {{ stocksStore.products.length }}</h3>
    <hr />
    <Filters />
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
