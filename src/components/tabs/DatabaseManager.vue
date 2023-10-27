<script setup lang="ts">
import { ref } from 'vue'

const message = ref('')

function dataFlush() {
  for (const key in localStorage) {
    if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
      if (key.match(/\bSB4_/i)) {
        delete localStorage[key]
        console.log(key, ' deleted')
      }
    }
  }
}
</script>

<template>
  <section id="database-manager">
    <h2>database-manager</h2>
    <button @click="dataFlush">Wyczyść wszystkie dane</button>
    <!-- <pre id="messsage-box" v-model="message"></pre> -->
  </section>
</template>

<style scoped></style>
