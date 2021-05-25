import { MAX_STOPS } from '@/eggs/aviasales/constants'

export const isStopsValid = (value: any) => {
  return value >= 0 && value <= MAX_STOPS
}
