<script setup lang="ts">
import { ref, watch } from 'vue'
import { useStocks } from '@/stores/stocks'
import { defineDataType, convertToArray, removeGarbage } from '../Utils_DatabaseUpdate/functions'
import { stany_ilosci } from '../Utils_DatabaseUpdate/stany-ilosci'
import { stany_ceny } from '../Utils_DatabaseUpdate/stany-ceny'
import PasteButton from '../Utils_DatabaseUpdate/PasteButton.vue'

const stocks_store = useStocks()
const textbox = ref('')
const messagebox = ref('')
const datatype = ref()

watch(textbox, () => {
  const { message, data } = defineDataType(textbox.value)
  datatype.value = data
  messagebox.value = message
})

async function paste(data: Promise<string>) {
  textbox.value = await data
}

function clear() {
  textbox.value = ''
}

function submit(e: Event): void {
  const form = e.target as HTMLFormElement
  const form_textbox = form.elements.namedItem('textBox') as HTMLInputElement
  const array_data = convertToArray(form_textbox.value)
  const purified_data = removeGarbage(array_data, datatype.value)
  const formatted_data = formatData(purified_data, datatype.value)
  console.log(formatted_data)
}

function formatData(data: string[][], datatype: string) {
  let result = []
  for (const row of data) {
    const item = {} as Plywood
    const plywoodSize = getSize(row[1])
    const plywoodFootSize = getFootSize(plywoodSize)
    const plywoodVolumeUnit = getVolumeUnit(row[2])

    item.id = row[0]
    item.name = row[1]
    // item.unit = row[2]
    item.group = 'null'
    item.size = plywoodSize
    item.foot = plywoodFootSize
    if (datatype === 'prices') item.price = 0 // calcPrice()
    if (datatype === 'stocks') item.stock = 0 // calcQuant()

    result.push(item)
  }
  return result
}

function getSize(input: string) {
  const match = input.match(/\d+([,.]\d+)?x\d{2,4}x\d{2,4}/i)
  return match ? match[0] : undefined
}

function getFootSize(input: string | undefined) {
  if (input === undefined) return
  const numbers = input.split('x')
  const A = Math.round(Number(numbers[1]) / 305)
  const B = Math.round(Number(numbers[2]) / 305)
  return A < B ? `${A}x${B}'` : `${B}x${A}'`
}

function getVolumeUnit(input: string) {
  const match = input.match(/szt|m2|m3/i)
  return match ? match[0] : undefined
}

const somearr = [
  { id: 'one', name: 'one-name' }
  // { id: 'two', name: 'two-name' }
]
console.log(somearr)

somearr.splice(-1, 0, { id: 'tre', name: 'tre-name' })
console.log(somearr)

const findone = somearr.findIndex((row) => {
  return row.id.match(/tre/)
})

console.log(findone)
</script>

<template>
  <section id="database-update">
    <h2>Wczytywanie danych</h2>
    <form id="myform" @submit.prevent="submit">
      <textarea class="text-box" name="textBox" v-model="textbox"></textarea>

      <input type="text" class="message-box" name="message-box" v-model="messagebox" disabled />

      <div class="buttonbar">
        <button type="button" @click="clear">
          <span>Wyczyść</span>
          <i class="bi bi-backspace"></i>
        </button>

        <PasteButton @clipboard-paste="paste">
          <span>Wklej ze schowka</span>
          <i class="bi bi-save"></i>
        </PasteButton>

        <button type="submit" :disabled="!datatype">
          <span>Zatwierdź</span>
          <i class="bi bi-check2"></i>
        </button>
      </div>

      <h4>Template data</h4>
      <div class="buttonbar">
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
../DatabaseUpdateUtils/functions
