import type { Egg } from '@redux-eggs/core'

import { startClockWatcher } from '@/eggs/clock/saga'
import { CLOCK_SLICE, clockReducer } from '@/eggs/clock/slice'
import type { AppStore } from '@/store'

export const getClockEgg = (): Egg<AppStore> => {
  return {
    id: 'clock',
    reducersMap: {
      [CLOCK_SLICE]: clockReducer,
    },
    sagas: [startClockWatcher],
  }
}
