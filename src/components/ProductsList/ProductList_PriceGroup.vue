<script setup lang="ts">
import { calcPrice } from '../Utils/functions'
import { defineProps } from 'vue'

defineProps<{
  p: Plywood
}>()
</script>

<template>
  <div class="product-price-3">{{ calcPrice(p.size, p.price, 'm3', 'm3').toFixed(2) }} zł/m3</div>
  <div class="product-price-2">{{ calcPrice(p.size, p.price, 'm3', 'm2').toFixed(2) }} zł/m2</div>
  <div class="product-price-1">{{ calcPrice(p.size, p.price, 'm3', 'szt').toFixed(2) }} zł/szt</div>
</template>

<style scoped></style>
