<script setup lang="ts">
import { useSortingStore } from '@/stores/sortingStore'

const collator = new Intl.Collator(undefined, {
  usage: 'sort',
  numeric: true
})

const randomarr = [16, 2, 13, 17, 12, 20, 6, 14, 9, 8, 18, 1, 19, 15, 11, 4, 3, 10, 7, 5]

console.log(randomarr)
randomarr.sort((a, b) => collator.compare(a, b))
console.log(randomarr)
randomarr.sort((a, b) => collator.compare(b, a))
console.log(randomarr)

// const sortOptions = [
//   // {}
// ]
</script>

<template>
  <section>
    <h3>Sortowanie</h3>
  </section>
</template>

<style scoped></style>
