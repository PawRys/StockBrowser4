td
<script setup lang="ts">
import { usePageStore } from '@/stores/paginationStore'
import { useStocksStore } from '@/stores/stocksStore'
import { calcPrice, calcQuant } from '../Utils/functions'
import Pagination from '../ProductsList/ProductPagination.vue'
import Filters from '../ProductsList/ProductFilters.vue'
import Sorting from '../ProductsList/ProtuctSorting.vue'

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
    <Pagination id="main-pagination" />
    <Sorting />
    <ol id="products">
      <template
        v-for="p in stocksStore.products.slice(
          pageStore.firstItemOnPage,
          pageStore.firstItemOnPage + pageStore.pageSize
        )"
        :key="p.id"
      >
        <li>
          <div class="product-header">
            <!-- <span>{{ pageStore.firstItemOnPage + i + 1 }}. </span> -->
            <span>{{ p.id }}</span> - <span class="product-name">{{ p.name }}</span>
          </div>
          <div class="product-details">
            <span>{{ p.size }}</span>
            <span>{{ p.attr.faceType }}</span>
            <span>{{ p.attr.color }}</span>
            <span>{{ p.attr.footSize }}</span>
            <span>{{ p.attr.woodType }}</span>
            <span>{{ p.attr.glueType }}</span>
          </div>
          <div class="product-price-3">
            {{ calcPrice(p.size, p.price, 'm3', 'm3').toFixed(2) }} zł/m3
          </div>
          <div class="product-quant-3">
            {{ calcQuant(p.size, p.totalStock, 'm3', 'm3').toFixed(3) }} m3
          </div>
          <div class="product-quant-2">
            {{ calcQuant(p.size, p.totalStock, 'm3', 'm2').toFixed(2) }} m2
          </div>
          <div class="product-quant-1">
            {{ calcQuant(p.size, p.totalStock, 'm3', 'szt').toFixed(1) }} szt.
          </div>
        </li>
      </template>
    </ol>
    <Pagination />
  </section>
</template>

<style scoped>
ol {
  list-style: none;
  padding: 0;
}

li {
  box-shadow: -1px 1px 3px -1px #ddd;
  margin-block: 1rem;
}

li > * {
  margin: 1ch;
}

.product-details {
  display: flex;
  gap: 1ch;
}

.product-details > span {
  padding: 0ch 1.4ch;
}
.product-details > span::after {
  content: '';
  position: absolute;
  z-index: -1;
  inset: 0;
  background-color: cornflowerblue;
  transform: skewX(135deg);
}

/*
table {
  border-collapse: collapse;
}
td {
  border: solid 1px skyblue;
  padding: 0.2rem 0.3rem;
}
*/
</style>
