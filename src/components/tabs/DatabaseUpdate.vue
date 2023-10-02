<script setup lang="ts">
import { ref, watch } from 'vue'
import { defineDataType } from '../DatabaseUpdateUtils/functions_lib'
import PasteButton from '../DatabaseUpdateUtils/PasteButton.vue'
import { stany_ilosci } from '../DatabaseUpdateUtils/stany-ilosci'
import { stany_ceny } from '../DatabaseUpdateUtils/stany-ceny'

const textbox = ref('')
const messagebox = ref('')

watch(textbox, () => {
  const { message } = defineDataType(textbox.value)
  messagebox.value = message
})

async function paste(data: Promise<string>) {
  textbox.value = await data
}

function clear() {
  textbox.value = ''
}

function submit(e: Event): void {
  console.log(e)
}

// function testinput(e: Event) {
// const t = e.target as HTMLInputElement
// const data = t?.value || ''
//   console.log(e)
// }
</script>

<template>
  <section id="database-update">
    <h2>Wczytywanie danych</h2>
    <form @submit.prevent="submit">
      <textarea class="text-box" v-model="textbox"></textarea>

      <input type="text" class="message-box" v-model="messagebox" disabled />
      <!-- <input type="text" class="message-box" v-model="messagebox" readonly /> -->

      <div class="buttonbar">
        <button type="button" @click="clear">
          <span>Wyczyść</span>
          <i class="bi bi-backspace"></i>
        </button>

        <PasteButton @clipboard-paste="paste">
          <span>Wklej ze schowka</span>
          <i class="bi bi-save"></i>
        </PasteButton>

        <button type="submit">
          <span>Zatwierdź</span>
          <i class="bi bi-check2"></i>
        </button>
      </div>

      <div class="buttonbar">
        <h4>Template data</h4>
        <button type="button" @click="textbox = stany_ilosci">Wklej Stany ilościowe</button>
        <button type="button" @click="textbox = stany_ceny">Wklej Stany z cenami</button>
      </div>
    </form>
  </section>
</template>

<style scoped>
form {
  display: grid;
  gap: 1ch;
}
.text-box {
  padding: 0.6ch 1ch;
  width: 100%;
  height: 5rem;
}

.message-box {
  border: none;
  width: 100%;
  background-color: transparent;

  display: grid;
  grid-template-rows: 0fr;
  transition-property: grid-template-rows;
  transition-duration: 200ms;
}

.message-box > * {
  overflow: hidden;
}
.message-box.active {
  grid-template-rows: 2fr;
}
</style>
