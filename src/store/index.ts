import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'

interface PageState {
  phoneNumber: object
}

export const usePageStore = defineStore('page', {
  state: (): PageState => ({
    phoneNumber: {},
  }),
  actions: {},
})
