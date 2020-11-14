import { ALLOWED_SORT } from '@/modules/aviasales/constants'

export const isSortValid = (value: any): boolean => {
  return value && ALLOWED_SORT.includes(value)
}
