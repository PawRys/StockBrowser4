<script setup lang="ts">
import { usePageStore } from '@/stores/paginationStore'

const page_store = usePageStore()
</script>

<template>
  <div class="pagination">
    <button class="prev-page" @click="page_store.prevPage">prev</button>
    <button>{{ page_store.page }}</button>
    <!-- / -->
    <!-- <button>{{ page_store.pageSize }}</button> -->
    <button class="next-page" @click="page_store.nextPage">next</button>
  </div>
</template>

<style scoped>
.pagination {
  background-color: hotpink;
}
</style>
