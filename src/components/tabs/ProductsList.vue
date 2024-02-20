<script setup lang="ts">
// import { ref, computed } from 'vue'
import { usePageStore } from '@/stores/paginationStore'
import { useStocksStore } from '@/stores/stocksStore'
import Pagination from '../ProductsList/ProductPagination.vue'
import Filters from '../ProductsList/ProductFilters.vue'
import Sorting from '../ProductsList/ProtuctSorting.vue'

const pageStore = usePageStore()
const stocksStore = useStocksStore()
// console.log(stocksStore.products)
</script>

<template>
  <section id="products-list">
    <h2>Products</h2>
    <h3>List length: {{ stocksStore.products.length }}</h3>
    <hr />
    <Filters />
    <hr />
    <Pagination />
    <Sorting />
    <table id="products">
      <tr
        v-for="(product, i) in stocksStore.products.slice(
          pageStore.firstItemOnPage,
          pageStore.firstItemOnPage + pageStore.pageSize
        )"
        :key="product.id"
      >
        <td>{{ pageStore.firstItemOnPage + i + 1 }}.</td>
        <td>{{ product.attr.faceType }}</td>
        <td>{{ product.attr.color }}</td>
        <td>{{ product.attr.sizeT }}</td>
        <td>{{ product.attr.footSize }}</td>
        <td>{{ product.attr.sizeA }}</td>
        <td>{{ product.attr.sizeB }}</td>
        <td>{{ product.attr.woodType }}</td>
        <td>{{ product.attr.glueType }}</td>
        <!-- <td>{{ product.stockStatus }}</td> -->
        <td>{{ product.id }}</td>
        <td>{{ product.name }}</td>
        <td>{{ product.price }}</td>
      </tr>
    </table>
    <Pagination />
  </section>
</template>

<style scoped>
table {
  border-collapse: collapse;
}
td {
  border: solid 1px skyblue;
  padding: 0.2rem 0.3rem;
}
</style>
