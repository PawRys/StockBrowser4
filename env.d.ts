/// <reference types="vite/client" />

type Plywood = {
  id: string
  name: string
  size: string
  attr: {
    sizeT: string
    sizeA: string
    sizeB: string
    color: string
    faceType: string
    footSize: string
    glueType: string
    woodType: string
  }
  price: number
  totalStock: number
  aviableStock: number
  stockStatus: number
  inventory?: string[]
}
