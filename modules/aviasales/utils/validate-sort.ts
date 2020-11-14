import { ALLOWED_SORTS } from '@/modules/aviasales/constants'

export const isSortValid = (value: any): boolean => {
  return value && ALLOWED_SORTS.includes(value)
}
