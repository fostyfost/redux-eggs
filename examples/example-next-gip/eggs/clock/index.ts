import type { Egg } from '@redux-eggs/redux'

import { clockReducer } from './reducer'
import { startClockWatcher } from './saga'

export const CLOCK_MODULE_NAME = 'clock-egg' as const

export const getClockEgg = (): Egg => {
  return {
    id: CLOCK_MODULE_NAME,
    reducerMap: {
      [CLOCK_MODULE_NAME]: clockReducer,
    },
    sagas: [startClockWatcher],
  }
}
