<script setup lang="ts">
// import { ref, computed } from 'vue'
import { usePageStore } from '@/stores/paginationStore'
import { useStocksStore } from '@/stores/stocksStore'
import Pagination from '../ProductsList/ProductPagination.vue'
import Filters from '../ProductsList/ProductFilters.vue'

const pageStore = usePageStore()
const stocksStore = useStocksStore()
console.log(stocksStore.products)
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
          pageStore.firstItemOnPage,
          pageStore.firstItemOnPage + pageStore.pageSize
        )"
        :key="product.id"
      >
        {{ pageStore.firstItemOnPage + i + 1 }}: {{ product.id }} : {{ product.name }} :
        {{ product.attr.color }}
      </li>
    </ul>
    <Pagination />
  </section>
</template>

<style scoped></style>
