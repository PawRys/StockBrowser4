<script setup lang="ts">
import { ref, watch } from 'vue'
import { useStocks } from '@/stores/stocks'
import { defineDataType, convertToArray, removeGarbage } from '../Utils_DatabaseUpdate/functions'
import { calcPrice, calcQuant } from '../Utils/functions'
import { stany_ilosci } from '../Utils_DatabaseUpdate/stany-ilosci'
import { stany_ceny } from '../Utils_DatabaseUpdate/stany-ceny'
import PasteButton from '../Utils_DatabaseUpdate/PasteButton.vue'

const stocks_store = useStocks()
const messagebox = ref('')
const datatype = ref()
const textbox = ref('')

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
  console.time('save to store')
  const form = e.target as HTMLFormElement
  const form_textbox = form.elements.namedItem('textBox') as HTMLInputElement
  const array_data = convertToArray(form_textbox.value)
  const purified_data = removeGarbage(array_data, datatype.value)
  // const formatted_data =
  arrayIndexSaving(purified_data, datatype.value)
  // console.log(formatted_data)
  console.timeEnd('save to store')
}

function arrayIndexSaving(data: string[][], datatype: string) {
  // const products = stocks_store.products
  const products = JSON.parse(localStorage.stocks_store_v4 || '[]')
  for (const row of data) {
    const plywoodSize = getSize(row[1])
    const plywoodFootSize = getFootSize(plywoodSize)
    const plywoodVolumeUnit = getVolumeUnit(row[2])

    const productIndex = products.findIndex((i: Plywood) => i.id === row[0])
    const i = productIndex < 0 ? products.length : productIndex

    if (productIndex < 0) {
      products[i] = {} as Plywood /** create new product */
    }

    products[i].id = row[0]
    products[i].name = row[1]
    products[i].group = 'no data aviable'
    products[i].size = plywoodSize
    products[i].foot = plywoodFootSize
    if (datatype === 'prices') {
      const total_price = Number(row[5].replace(',', '.'))
      const total_stock = Number(row[3].replace(',', '.'))
      const unit_price = total_price / total_stock || 0
      products[i].price = calcPrice(plywoodSize, unit_price, plywoodVolumeUnit, 'm3')
    }
    if (datatype === 'stocks') {
      const total_stock = Number(row[6].replace(',', '.'))
      const aviable_stock = Number(row[3].replace(',', '.'))
      const total_status = total_stock > 0 ? 1 : undefined
      const aviable_status = aviable_stock > 0 ? 2 : undefined
      products[i].stock_total = calcQuant(plywoodSize, total_stock, plywoodVolumeUnit, 'm3')
      products[i].stock_aviable = calcQuant(plywoodSize, aviable_stock, plywoodVolumeUnit, 'm3')
      products[i].stock_status = aviable_status || total_status || 0
    }
  }
  stocks_store.products = products
  localStorage.stocks_store_v4 = JSON.stringify(products)
}

function getSize(input: string) {
  const match = input.match(/\d+([,.]\d+)?x\d{2,4}x\d{2,4}/i)
  return match ? match[0].replace(/,/g, '.') : undefined
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

interface Myarr {
  id: string
  name?: string
}

const somearr: Myarr[] = [
  { id: 'one', name: 'one-name' },
  { id: 'two', name: 'two-name' }
]
console.log(somearr)

// somearr.splice(1, 1, { id: 'tre' })
somearr[2] = {} as Myarr
somearr[2].id = 'tre'
somearr[2].name = 'tre-name'
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
