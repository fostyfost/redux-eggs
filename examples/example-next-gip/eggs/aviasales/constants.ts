import { Sort } from '@/eggs/aviasales/contracts/sort'

export const DELAY_LENGTH = 100

export const MAX_TRIES = 3

export const DEFAULT_SORT = Sort.CHEAPEST

export const DEFAULT_STOPS = [0]

export const ALLOWED_SORTS = Object.values(Sort)

export const MAX_STOPS = 3

export const AVAILABLE_STOPS = Array.from({ length: MAX_STOPS + 1 }).map((_, index) => index)

export const SEGMENTS_LENGTH = 2

export const MAX_TICKETS_LENGTH_TO_SHOW = 5

export const StopsValueToLabelMap: Record<string | number, string> = {
  '0': 'Без пересадок',
  '1': '1 пересадка',
  '2': '2 пересадки',
  '3': '3 пересадки',
}
