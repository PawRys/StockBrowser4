/// <reference types="vite/client" />

interface Plywood {
  id: string
  name: string
  size: string
  attr: {
    sizeA?: string
    sizeB?: string
    sizeC?: string
    color?: string
    faceType?: string
    footSize?: string
    glueType?: string
    woodType?: string
  }
  price?: number
  stock_total?: number
  stock_aviable?: number
  stock_status?: number
  inventory?: string[]
}
