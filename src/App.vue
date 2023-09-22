<script setup lang="ts">
import { useCurrentTabStore } from '@/stores/currentTabStore'

import ProductsList from './components/tabs/ProductsList.vue'
import DatabaseShare from './components/tabs/DatabaseShare.vue'
import DatabaseUpdate from './components/tabs/DatabaseUpdate.vue'
import DatabaseManager from './components/tabs/DatabaseManager.vue'

const tabs = [
  { comp: ProductsList, name: 'ProductsList', label: 'Produkty' },
  { comp: DatabaseShare, name: 'DatabaseShare', label: 'Załaduj dane' },
  { comp: DatabaseUpdate, name: 'DatabaseUpdate', label: 'DatabaseUpdate' },
  { comp: DatabaseManager, name: 'DatabaseManager', label: 'DatabaseManager' }
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
  <component :is="tabs[currentTab.tabId].comp" class="tab"></component>
</template>

<style scoped></style>
@/stores/appTabStore @/stores/currentTabStore
