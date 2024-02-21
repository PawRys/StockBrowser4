<script setup lang="ts">
import { useSortingStore } from '@/stores/sortingStore'
import { escapeNonword } from '../Utils/functions'
const s = useSortingStore()
const sortTable = [
  { column: 'id', label: 'Kod', unit: 'm3' },
  { column: 'size', label: 'Wymiar', unit: 'm3' },
  { column: 'price', label: 'Zakup m3', unit: 'm3' },
  { column: 'price', label: 'Zakup m2', unit: 'm2' },
  { column: 'price', label: 'Zakup szt', unit: 'pcs' }
]
</script>

<template>
  <section>
    <h3>Sortowanie</h3>
    <template v-for="i in sortTable" :key="escapeNonword(i.label)">
      <button
        @click="
          [(s.sortColumn = i.column), (s.sortUnit = i.unit), (s.sortDir = (s.sortDir + 1) % 2)]
        "
      >
        {{ i.label }}
      </button>
    </template>
    <!-- <button @click="[(s.sortColumn = 'id'), (s.sortDir = 'asc')]">sort up</button>
    <button @click="[(s.sortColumn = 'id'), (s.sortDir = 'desc')]">sort dn</button> -->
  </section>
</template>

<style scoped></style>
