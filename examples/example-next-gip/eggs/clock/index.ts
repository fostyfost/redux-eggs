import type { Egg } from '@redux-eggs/redux'

import { CLOCK_REDUCER_KEY, clockReducer } from '@/eggs/clock/reducer'
import { startClockWatcher } from '@/eggs/clock/saga'

export const getClockEgg = (): Egg => {
  return {
    id: 'clock',
    reducerMap: {
      [CLOCK_REDUCER_KEY]: clockReducer,
    },
    sagas: [startClockWatcher],
  }
}
