<script setup lang="ts">
import { ref, unref, watch } from 'vue'
// import { useStocksStore } from '@/stores/stocks'
import { defineDataType, convertToArray, removeGarbage } from '../DatabaseUpdate/functions'
import { calcPrice, calcQuant } from '../Utils/functions'
import { stany_ilosci } from '../DatabaseUpdate/stany-ilosci'
import { stany_ceny } from '../DatabaseUpdate/stany-ceny'
import PasteButton from '../DatabaseUpdate/PasteButton.vue'

import { useStocksStore } from '@/stores/stocksStore'
const stocksStore = useStocksStore()

// const stocks_store = useStocksStore()
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
  const formatted_data = convertToObject(purified_data, datatype.value)

  /**
   * Here add step where formatted_data is merged with database_data (localstorage data)
   * */
  console.time('merge_data')
  mergeData(formatted_data, JSON.parse(localStorage.SB4_products || '[]'))
  console.timeEnd('merge_data')
  // console.log(stocksStore.test)

  // console.log(
  // formatted_data
  // formatted_data.filter((el: Plywood) => el.attr.sizeA?.match(/\b(6\.5)\b/gi))
  // .filter((el: Plywood) => el.faceType?.match(/()/i))
  // .filter((el: Plywood) => el.woodType?.match(/()/i))
  // .filter((el: Plywood) => el.footSize?.match(/()/i))
  // .filter((el: Plywood) => el.color?.match(/()/i))
  // .map((el: Plywood) => [el.flags, el.id, el.name].join(' | '))
  // )
  console.timeEnd('save to store')
}

function mergeData(newData: Plywood[], databaseCopy: Plywood[]) {
  /**
   * - take ALL newData and assign to coresponding databaseCopy
   * - create new objects in databaseCopy if necessary
   * - return databaseCopy with mereged newData
   */

  for (const plywood of newData) {
    const indexOfDatabaseCopy = databaseCopy.findIndex((item) => item.id === plywood.id)
    if (indexOfDatabaseCopy < 0) {
      databaseCopy.push(plywood)
    } else {
      Object.assign(databaseCopy[indexOfDatabaseCopy], plywood)
    }
  }

  localStorage.SB4_products = JSON.stringify(databaseCopy)
  // console.log(newData, databaseCopy)
}

function convertToObject(data: string[][], datatype: string): Plywood[] {
  /**
   * Should move merging existing data with fresh data to stocksStore saveProducts method
   * */
  let products = []
  for (const row of data) {
    const plywood = {} as Plywood
    const plywoodSize = getSize(row[1])
    const plywoodFootSize = getFootSize(plywoodSize)
    const plywoodVolumeUnit = getVolumeUnit(row[2])
    const searchString = `${row[1]} ${row[0]} `

    plywood.id = row[0]
    plywood.name = row[1]
    plywood.size = plywoodSize || 'plywoodSize_undefined'
    plywood.attr = plywood.attr || {}
    plywood.attr.sizeA = plywoodSize?.split('x')[0] || '0'
    plywood.attr.sizeB = plywoodSize?.split('x')[1] || '0'
    plywood.attr.sizeC = plywoodSize?.split('x')[2] || '0'
    plywood.attr.footSize = plywoodFootSize || 'plywoodFootSize_undefined'
    plywood.attr.faceType = getFaceType(searchString)
    plywood.attr.glueType = getGlueType(searchString)
    plywood.attr.woodType = getWoodType(searchString)
    plywood.attr.color = getColor(searchString)

    if (datatype === 'prices') {
      const total_price = Number(row[5].replace(',', '.'))
      const total_stock = Number(row[3].replace(',', '.'))
      const calculation = total_price / total_stock
      const unit_price = isFinite(calculation) ? calculation : 0
      plywood.price = calcPrice(plywoodSize, unit_price, plywoodVolumeUnit, 'm3')
    }

    if (datatype === 'stocks') {
      const total_stock = Number(row[6].replace(',', '.'))
      const aviable_stock = Number(row[3].replace(',', '.'))
      const total_status = total_stock > 0 ? 1 : undefined
      const aviable_status = aviable_stock > 0 ? 2 : undefined
      plywood.stock_total = calcQuant(plywoodSize, total_stock, plywoodVolumeUnit, 'm3')
      plywood.stock_aviable = calcQuant(plywoodSize, aviable_stock, plywoodVolumeUnit, 'm3')
      plywood.stock_status = aviable_status || total_status || 0
    }

    products.push(plywood)
  }
  return products
}

function getSize(input: string) {
  const match = input.match(/\d+([,.]\d+)?x\d{2,4}x\d{2,4}/i)
  return match ? match[0].replace(/,/g, '.') : undefined
}

function getFootSize(input: string | undefined) {
  if (input === undefined) return undefined
  const numbers = input.split('x')
  const A = Math.round(Number(numbers[1]) / 305)
  const B = Math.round(Number(numbers[2]) / 305)
  return A < B ? `${A}x${B}'` : `${B}x${A}'`
}

function getVolumeUnit(input: string) {
  const match = input.match(/szt|m2|m3/i)
  return match ? match[0] : undefined
}

function getGlueType(text: string): string {
  if (/sucho|\bMR\b|\bINT\b/g.test(text)) return 'MR'
  if (/wodo|\bWD\b|\bEXT\b|\bE\b/g.test(text)) return 'WD'
  if (/lamin|foliowana|antypo/g.test(text)) return 'WD'
  if (/melamin|M\?M/g.test(text)) return 'WD'

  return 'WD/MR'
}

function getFaceType(text: string): string {
  if (/\bPQ\W?F\b/gi.test(text)) return 'PQF'
  if (/\bPQ\b/gi.test(text)) return 'PQ'
  if (/s11\/|kilo/gi.test(text)) return 'Kilo'

  if (/\bPF\b|poliform/gi.test(text)) return 'Poliform'
  if (/\bPPL\b/gi.test(text)) return 'PPL'

  if (/\bF\/W\W?H\b|Heksa/gi.test(text)) return 'Heksa'
  if (/\bF\/W\b|anty/gi.test(text)) return 'FW'

  if (/opal/gi.test(text)) return 'Opal White'
  if (/honey/gi.test(text)) return 'Honey'
  if (/\bM\/M\b|mel/gi.test(text)) return 'MM'
  if (/\bF\/F\b|lamin|folio/gi.test(text)) return 'FF'

  if (/OSB/gi.test(text)) return 'OSB'

  const regexpGrade = /\b(S|B|BB|CP|WG|WGE|C|CC|V)\b/
  const expression = new RegExp(`${regexpGrade.source}/${regexpGrade.source}`, 'gi')
  if (expression.test(text)) {
    const grade = text.match(expression)
    return grade ? grade[0] : 'zonk'
  }
  return '??/??'
}

function getWoodType(text: string): string {
  const results = new Set()

  if (/\bEUK\b|eukaliptus/gi.test(text)) results.add('Eukaliptus')
  if (/\bTB\b|bintangor/gi.test(text)) results.add('Bintangor')
  if (/\bCH\b|topol/gi.test(text)) results.add('Topola')
  if (/\bRP\b|radiata/gi.test(text)) results.add('Radiata')
  if (/pine/gi.test(text)) results.add('Sosna')
  if (/liścia/gi.test(text)) results.add('Liściasta')
  if (/iglasta/gi.test(text)) results.add('Iglasta')

  if (results.size === 0) {
    results.add('bez gatunku')
  }
  return Array.from(results).join(' ')
}

function getColor(text: string): string {
  const results = new Set()

  if (/c\.less|trans|bezbarwna/gi.test(text)) results.add('C.less')
  if (/white|biał[ya]/gi.test(text)) results.add('White')
  if (/black|czarn[ya]/gi.test(text)) results.add('Black')
  if (/blue|niebiesk[ia]/gi.test(text)) results.add('Blue')
  if (/green|zielon[ya]/gi.test(text)) results.add('Green')
  if (/\bred\b|czerwon[ya]/gi.test(text)) results.add('Red')
  if (/yell|zółt[ya]/gi.test(text)) results.add('Yellow')
  if (/(?<!(l\. ?|jasn[yoa] ?|light ?))(grey|szar[ya])/gi.test(text)) results.add('Grey')
  if (/(?<=(l\. ?|jasn[yoa] ?|light ?))(grey|szar[ya])/gi.test(text)) results.add('L.grey')
  if (/(?<!(l\. ?|jasn[yoa] ?|light ?))(d\.)?(br|brąz|brown)/gi.test(text)) results.add('D.brown')
  if (/(?<=(l\. ?|jasn[yoa] ?|light ?))(br|brąz|brown)/gi.test(text)) results.add('L.brown')

  if (results.size === 0) {
    if (/M\/M/gi.test(text)) results.add('White')
    if (/[FW]\/[FW]/gi.test(text)) results.add('D.brown')
  }

  if (results.size === 0) {
    results.add('no color')
  }

  return Array.from(results).join(' ')
}
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
