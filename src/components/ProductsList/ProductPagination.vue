<script setup lang="ts">
import { usePageStore } from '@/stores/paginationStore'
import { scrollTo } from '../Utils/functions'

const pageStore = usePageStore()
const pageSizeOptions = [10, 20, 50, 100]
const scrollTarget = '#main-pagination'
const remOffset = -2

function prevPage() {
  pageStore.prevPage()
  scrollTo(scrollTarget, remOffset)
}
function nextPage() {
  pageStore.nextPage()
  scrollTo(scrollTarget, remOffset)
}
function setPage(e: Event) {
  pageStore.setPage(e)
  scrollTo(scrollTarget, remOffset)
}
</script>

<template>
  <div class="product-pagination">
    <button class="prev-page" @click="prevPage">prev</button>

    <button>
      <select class="set-page" @change="setPage">
        <option
          v-for="page in pageStore.pageCount"
          :key="`pageCount-${page}`"
          :value="page"
          :selected="page === pageStore.currentPageNo"
        >
          {{ page }}
        </option>
      </select>
      / {{ pageStore.pageCount }}
    </button>

    <button class="next-page" @click="nextPage">next</button>

    <select class="set-page-size" @change="pageStore.setPageSize">
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

<style scoped></style>
