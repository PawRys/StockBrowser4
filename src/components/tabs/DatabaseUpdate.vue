<script setup lang="ts">
import { ref, watch } from 'vue'
// import { useStocksStore } from '@/stores/stocks'
import { defineDataType, convertToArray, removeGarbage } from '../DatabaseUpdate/functions'
import { calcPrice, calcQuant } from '../Utils/functions'
import { stany_ilosci } from '../DatabaseUpdate/stany-ilosci'
import { stany_ceny } from '../DatabaseUpdate/stany-ceny'
import PasteButton from '../DatabaseUpdate/PasteButton.vue'

import { useStocksStore } from '@/stores/stocksStore'
const stocksStore = useStocksStore()

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
  const data_as_array = convertToArray(form_textbox.value)
  const data_as_array_purified = removeGarbage(data_as_array, datatype.value)
  const data_in_final_shape = convertToObject(data_as_array_purified, datatype.value)

  console.time('merge_data')
  const data_from_localStorage = JSON.parse(stocksStore.test2 || '[]')
  // const data = stocksStore.test2
  const mergedData = mergeData(data_in_final_shape, data_from_localStorage)
  stocksStore.saveProducts(mergedData)
  console.timeEnd('merge_data')
  console.timeEnd('save to store')
}

function mergeData(newData: Plywood[], databaseCopy: Plywood[]) {
  for (const plywood of newData) {
    const indexOfDatabaseCopy = databaseCopy.findIndex((item) => item.id === plywood.id)
    if (indexOfDatabaseCopy < 0) {
      databaseCopy.push(plywood)
    } else {
      Object.assign(databaseCopy[indexOfDatabaseCopy], plywood)
    }
  }
  return databaseCopy
}

function convertToObject(data: string[][], datatype: string): Plywood[] {
  let products = []
  for (const row of data) {
    const plywood = {} as Plywood
    const plywoodSize = getSize(row[1])
    const plywoodVolumeUnit = getVolumeUnit(row[2])
    const searchString = `${row[1]} ${row[0]} `
    const faceType_val = getFaceType(searchString)
    const glueType_val = getGlueType(searchString)
    const woodType_val = getWoodType(searchString)
    const color_val = getColor(searchString, faceType_val)

    plywood.id = row[0]
    plywood.name = row[1] || '???'
    plywood.size = plywoodSize || '???'
    plywood.attr = plywood.attr || {}
    plywood.attr.sizeT = plywoodSize?.split('x')[0] || '???'
    plywood.attr.sizeA = plywoodSize?.split('x')[1] || '???'
    plywood.attr.sizeB = plywoodSize?.split('x')[2] || '???'
    plywood.attr.footSize = getFootSize(plywoodSize) || '???'
    plywood.attr.faceType = faceType_val
    plywood.attr.glueType = glueType_val
    plywood.attr.woodType = woodType_val
    plywood.attr.color = color_val
    // plywood.price = 0
    // plywood.totalStock = 0
    // plywood.aviableStock = 0
    plywood.stockStatus = 0

    if (datatype === 'prices') {
      const total_price = Number(row[5].replace(',', '.'))
      const total_stock = Number(row[3].replace(',', '.'))
      const calculation = total_price / total_stock
      const unit_price = isFinite(calculation) ? calculation : 0
      plywood.price = calcPrice(plywoodSize, unit_price, plywoodVolumeUnit, 'm3')
    }

    if (datatype === 'stocks') {
      const totalStock = Number(row[6].replace(',', '.'))
      const total_status = totalStock > 0 ? 1 : undefined
      const aviableStock = Number(row[3].replace(',', '.'))
      const aviable_status = aviableStock > 0 ? 2 : undefined
      plywood.totalStock = calcQuant(plywoodSize, totalStock, plywoodVolumeUnit, 'm3')
      plywood.aviableStock = calcQuant(plywoodSize, aviableStock, plywoodVolumeUnit, 'm3')
      plywood.stockStatus = aviable_status || total_status || 0
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
  return '???'
}

function getFaceType(text: string): string {
  /* Keep order & A>Z if equal order */
  /*1*/ if (/\bPQ\W?F\b/gi.test(text)) return 'PQF'
  /*2*/ if (/\bPQ\b/gi.test(text)) return 'PQ'
  /*3*/ if (/s11\/|kilo/gi.test(text)) return 'Kilo'

  /*4*/ if (/\bF\/W\W?H\b|Heksa/gi.test(text)) return 'Heksa'
  /*4*/ if (/\bhoney\b/gi.test(text)) return 'Honey'
  /*4*/ if (/\bM\/M\b|mel/gi.test(text)) return 'M/M'
  /*4*/ if (/\bopal\b/gi.test(text)) return 'Opal White'
  /*4*/ if (/\bPF\b|poliform/gi.test(text)) return 'Poliform'
  /*4*/ if (/\bPPL\b/gi.test(text)) return 'PPL'

  // /*5*/ if (/s12|s13|\bF\/F\b|lamin|folio/gi.test(text)) return 'F/F'
  // /*5*/ if (/s14|s15|\bF\/W\b|anty/gi.test(text)) return 'F/W'
  // /*5*/ if (/s16|s17|\bW\/W\b/gi.test(text)) return 'W/W'
  /*5*/ if (/s12|s13/gi.test(text)) return 'F/F'
  /*5*/ if (/s14|s15/gi.test(text)) return 'F/W'
  /*5*/ if (/s16|s17/gi.test(text)) return 'W/W'
  /*5*/ if (/OSB/gi.test(text)) return 'OSB'

  const regexpGrade = /\b(S|B|BB|CP|WG|WGE|C|CC|V|M|F|W)\b/
  const expression = new RegExp(`${regexpGrade.source}/${regexpGrade.source}`, 'gi')
  if (expression.test(text)) {
    const grade = text.match(expression)
    return grade ? grade[0] : '??/??'
  }
  return '???'
}

function getWoodType(text: string): string {
  const results = new Set()

  if (/liścia/gi.test(text)) results.add('Liściasta')
  if (/iglasta/gi.test(text)) results.add('Iglasta')
  if (/pine|sosn/gi.test(text)) results.add('Sosna')
  if (/\bCH\b|topol/gi.test(text)) results.add('Topola')
  if (/\bRP\b|radiata/gi.test(text)) results.add('Radiata')
  if (/\bTB\b|bintangor/gi.test(text)) results.add('Bintangor')
  if (/\bEUK\b|eukaliptus/gi.test(text)) results.add('Eukaliptus')

  if (results.size === 0) {
    results.add('???')
  }
  return Array.from(results).join(' ')
}

function getColor(text: string, faceType: string): string {
  const results = new Set()

  if (/yell|zółt[ya]/gi.test(text)) results.add('Yellow')
  if (/white|biał[ya]/gi.test(text)) results.add('White')
  if (/black|czarn[ya]/gi.test(text)) results.add('Black')
  if (/green|zielon[ya]/gi.test(text)) results.add('Green')
  if (/blue|niebiesk[ia]/gi.test(text)) results.add('Blue')
  if (/\bred\b|czerwon[ya]/gi.test(text)) results.add('Red')
  if (/c\.less|trans|bezbarwna/gi.test(text)) results.add('C.less')
  if (/(?<!(l\. ?|jasn[yoa] ?|light ?))(grey|szar[ya])/gi.test(text)) results.add('Grey')
  if (/(?<=(l\. ?|jasn[yoa] ?|light ?))(grey|szar[ya])/gi.test(text)) results.add('L.grey')
  if (/(?<=(l\. ?|jasn[yoa] ?|light ?))(br|brąz|brown)/gi.test(text)) results.add('L.brown')
  if (/(?<!(l\. ?|jasn[yoa] ?|light ?))(d\.)?(br|brąz|brown)\b/gi.test(text)) results.add('D.brown')

  /* Apply defaults if no color specified */
  if (results.size === 0) {
    if (faceType === 'F/F') results.add('D.brown')
    if (faceType === 'F/W') results.add('D.brown')
    if (faceType === 'W/W') results.add('D.brown')
    if (faceType === 'Heksa') results.add('D.brown')
    if (faceType === 'Honey') results.add('Honey')
    if (faceType === 'M/M') results.add('White')
    if (faceType === 'Opal White') results.add('Opal')

    if (faceType === 'Poliform') results.add('inny')
    if (faceType === 'PPL') results.add('inny')
    if (faceType === 'PQF') results.add('inny')
  }
  if (results.size === 0) {
    if (faceType !== '???') results.add('surowa')
  }
  if (results.size === 0) {
    results.add('???')
  }
  return Array.from(results).join(' ')
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
