import type { Egg } from '@redux-eggs/core'

import { COUNT_REDUCER_KEY, countReducer } from '@/eggs/count/reducer'
import { countWatcher } from '@/eggs/count/saga'

export const getCountEgg = (): Egg => {
  return {
    id: 'count',
    reducerMap: {
      [COUNT_REDUCER_KEY]: countReducer,
    },
    sagas: [countWatcher],
  }
}
