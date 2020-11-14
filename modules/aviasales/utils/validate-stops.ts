import { MAX_STOPS } from '@/modules/aviasales/constants'

export const isStopsValid = (value: any) => {
  return value >= 0 && value <= MAX_STOPS
}
