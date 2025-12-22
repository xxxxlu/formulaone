import { ref } from 'vue'

export const isRouting = ref(true)

export const setRouting = (value: boolean) => {
  isRouting.value = value
}
