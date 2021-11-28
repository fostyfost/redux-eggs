import type { Egg } from '@redux-eggs/core'

import { countWatcher } from '@/eggs/count/saga'
import { COUNT_SLICE, countReducer } from '@/eggs/count/slice'
import type { AppStore } from '@/store'

export const getCountEgg = (): Egg<AppStore> => {
  return {
    id: 'count',
    reducersMap: {
      [COUNT_SLICE]: countReducer,
    },
    sagas: [countWatcher],
  }
}
