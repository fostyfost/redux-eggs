import type { Egg } from '@redux-eggs/core'

import { CLOCK_REDUCER_KEY, clockReducer } from '@/eggs/clock/reducer'
import { startClockWatcher } from '@/eggs/clock/saga'
import type { AppStore } from '@/store'

export const getClockEgg = (): Egg<AppStore> => {
  return {
    id: 'clock',
    reducersMap: {
      [CLOCK_REDUCER_KEY]: clockReducer,
    },
    sagas: [startClockWatcher],
  }
}
