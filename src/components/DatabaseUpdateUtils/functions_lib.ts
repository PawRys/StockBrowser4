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
    message = `Nie rozpoznano danych. ✖`
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
