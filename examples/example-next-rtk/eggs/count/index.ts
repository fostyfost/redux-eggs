import type { Egg } from '@redux-eggs/core'

import { countWatcher } from '@/eggs/count/saga'
import { COUNT_SLICE, countReducer } from '@/eggs/count/slice'

export const getCountEgg = (): Egg => {
  return {
    id: 'count',
    reducerMap: {
      [COUNT_SLICE]: countReducer,
    },
    sagas: [countWatcher],
  }
}
