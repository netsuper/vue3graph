import { defineStore } from "pinia"

export const useModel = defineStore('model',{
  state: () => {
    return {
      loggedIn: false,
     }
  }
})
