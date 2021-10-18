import type { Egg } from '@redux-eggs/redux-toolkit'

import { startClockWatcher } from '@/eggs/clock/saga'
import { CLOCK_SLICE, clockReducer } from '@/eggs/clock/slice'

export const getClockEgg = (): Egg => {
  return {
    id: 'clock',
    reducerMap: {
      [CLOCK_SLICE]: clockReducer,
    },
    sagas: [startClockWatcher],
  }
}
