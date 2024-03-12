<script setup lang="ts">
import { useSortingStore } from '@/stores/sortingStore'
import { escapeNonword } from '../Utils/functions'
const s = useSortingStore()
const sortingTable = [
  { column: 'id', label: 'Kod', unit: '' },
  { column: 'size', label: 'Wymiar', unit: '' },
  { column: 'price', label: 'Zakup m3', unit: 'm3' },
  { column: 'price', label: 'Zakup m2', unit: 'm2' },
  { column: 'price', label: 'Zakup szt', unit: 'pcs' },
  { column: 'totalStock', label: 'Całkowity m3', unit: 'm3' },
  { column: 'totalStock', label: 'Całkowity m2', unit: 'm2' },
  { column: 'totalStock', label: 'Całkowity szt', unit: 'pcs' },
  { column: 'aviableStock', label: 'Handlowy m3', unit: 'm3' },
  { column: 'aviableStock', label: 'Handlowy m2', unit: 'm2' },
  { column: 'aviableStock', label: 'Handlowy szt', unit: 'pcs' }
]
</script>

<template>
  <section>
    <h3>Sortowanie</h3>
    <template v-for="st in sortingTable" :key="escapeNonword(st.label)">
      <button @click="[(s.sortColumn = st.column), (s.sortUnit = st.unit), (s.sortDir *= -1)]">
        {{ st.label }}
      </button>
    </template>
  </section>
</template>

<style scoped></style>
