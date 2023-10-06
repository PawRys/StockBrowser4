/* eslint-disable no-regex-spaces */
/* eslint-disable no-control-regex */
export function defineDataType(input: string) {
  const text = input.trim()
  let dataType, message

  if (!text) {
    dataType = null
    message = ``
  } else {
    dataType = false
    message = `Nie rozpoznano danych. ❌`
  }
  const isStocks = /Stany i rezerwacje towarów/i.test(text)
  const isCorrectStockColumns =
    /Kod towaru		nazwa towaru		jm		stan handlowy	rezerwacje R	rezerwacje A		stan  całkowity	/i.test(text)
  if (isStocks && isCorrectStockColumns) {
    dataType = 'stocks'
    message = `📦 Rozpoznano stany i rezerwacje towarów.`
  }

  const isPrices = /Stany magazynowe towarów/i.test(text)
  const isCorrectPriceColumns = /Kod towaru		nazwa towaru		jm		stan	cena	wartość		/i.test(text)
  if (isPrices && isCorrectPriceColumns) {
    dataType = 'prices'
    message = `💵 Rozpoznano ceny zakupowe towarów.`
  }

  const isProdutsList = /Kod	Nazwa/i.test(text)
  const isProdutsItem = /\d+s\d+\/\d+/i.test(text)
  if (isProdutsList && isProdutsItem) {
    // dataType = 'products';
    // message = `📜 Rozpoznano listę produktów.`;
  }

  const codeLength = 4
  const isFullExchangeCode = new RegExp(`^\\d{${codeLength}}$`, 'i').test(text)
  if (isFullExchangeCode) {
    dataType = 'code'
    message = `🔢 Rozpoznano kod wymiany danych.`
  }

  const isPartExchangeCode = new RegExp(`^\\d{1,${codeLength - 1}}$`, 'i').test(text)
  if (isPartExchangeCode) {
    dataType = null
    message = `${text.replace(/\d/g, '✱').padEnd(codeLength, '⚹')}`
  }

  return { data: dataType, message: message }
}

export function convertToArray(data: string) {
  const result = []
  const lines = data.match(/[^\r\n]+/g) || []
  for (const line of lines) {
    const row = line.trim().split(/\t+/)
    result.push(row)
  }
  return result
}

export function removeGarbage(data: string[][], datatype: string) {
  const forbidden = /(stany|kod|podsumowanie|dostawa|transport|usługa|zamówienie)/gi
  const result = []
  for (const row of data) {
    if (datatype === 'prices' && row.length !== 6) continue
    if (datatype === 'stocks' && row.length !== 7) continue
    if (row.join('\t').match(forbidden)) continue
    result.push(row)
  }
  return result
}
