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
  price?: number
  total_stock?: number
  aviable_stock?: number
  stock_status: number
  inventory?: string[]
}

// interface Plywood {
//   id: string
//   name: string
//   size: string
//   attr: {
//     sizeT?: string
//     sizeA?: string
//     sizeB?: string
//     color?: string
//     faceType?: string
//     footSize?: string
//     glueType?: string
//     woodType?: string
//   }
//   price?: number
//   total_stock?: number
//   aviable_stock?: number
//   stock_status?: number
//   inventory?: string[]
// }
