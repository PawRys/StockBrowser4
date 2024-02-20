<script setup lang="ts">
import { useSortingStore } from '@/stores/sortingStore'
</script>

<template>
  <section>
    <h3>Sortowanie</h3>
    <button @click="useSortingStore().sortColumn = 'id'">ID</button>
    <button @click="useSortingStore().sortColumn = 'size'">SIZE</button>
    <button @click="useSortingStore().sortColumn = 'price'">PRICE</button>
  </section>
</template>

<style scoped></style>
