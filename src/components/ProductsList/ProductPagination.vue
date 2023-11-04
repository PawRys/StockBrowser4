<script setup lang="ts">
import { usePageStore } from '@/stores/paginationStore'

const pageStore = usePageStore()
const pageSizeOptions = [10, 20, 50, 100]
</script>

<template>
  <div class="pagination">
    <button class="prev-page" @click="pageStore.prevPage">prev</button>

    <select name="set-current-page" id="set-current-page" @change="pageStore.setCurrentPage">
      <option
        v-for="page in pageStore.pageCount"
        :key="`pageCount-${page}`"
        :value="page"
        :selected="page === pageStore.currentPage"
      >
        {{ page }}
      </option>
    </select>

    <button class="next-page" @click="pageStore.nextPage">next</button>

    <select name="set-page-size" id="set-page-size" @change="pageStore.setPageSize">
      <option
        v-for="size of pageSizeOptions"
        :key="`pageSize-${size}`"
        :value="size"
        :selected="size === pageStore.pageSize"
      >
        {{ size }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.pagination {
  background-color: hotpink;
}
</style>
