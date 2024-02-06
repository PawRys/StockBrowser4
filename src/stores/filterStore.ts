import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

interface TagFilter {
  sizeT?: string[]
  sizeA?: string[]
  sizeB?: string[]
  color?: string[]
  faceType?: string[]
  footSize?: string[]
  glueType?: string[]
  woodType?: string[]
}

export const useFilterStore = defineStore(
  'SB4_filterStore',
  () => {
    const status_filter = ref(1)
    const text_filter = ref('')
    const tag_filter = reactive({} as TagFilter)

    return { status_filter, text_filter, tag_filter }
  },
  { persist: false }
)
