<script setup lang="ts">
import { useCurrentTabStore } from '@/stores/currenttab'

import ProductsList from './components/tabs/ProductsList.vue'
import DatabaseShare from './components/tabs/DatabaseShare.vue'
import DatabaseUpdate from './components/tabs/DatabaseUpdate.vue'
import DatabaseManager from './components/tabs/DatabaseManager.vue'

const tabs = [
  { comp: ProductsList, name: 'ProductsList', icon: '', label: 'Lista produktów' },
  { comp: DatabaseUpdate, name: 'DatabaseUpdate', icon: '', label: 'Wczytaj dane' },
  { comp: DatabaseShare, name: 'DatabaseShare', icon: '', label: 'Udostępnij dane' },
  { comp: DatabaseManager, name: 'DatabaseManager', icon: '', label: 'Zarządzaj bazą danych' }
]
const currentTab = useCurrentTabStore()
</script>

<template>
  <h1>Stock Browser 4</h1>
  <div>
    <button v-for="(tab, index) in tabs" :key="index" @click="currentTab.tabId = index">
      {{ tab.label }}
    </button>
  </div>
  <Suspense>
    <component :is="tabs[currentTab.tabId].comp" class="tab"></component>
  </Suspense>
</template>

<style scoped></style>
