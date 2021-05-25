import type { Egg } from '@redux-eggs/redux'

import { countReducer } from './reducer'
import { countWatcher } from './saga'

export const COUNT_MODULE_NAME = 'count-egg' as const

export const getCountEgg = (): Egg => {
  return {
    id: COUNT_MODULE_NAME,
    reducerMap: {
      [COUNT_MODULE_NAME]: countReducer,
    },
    sagas: [countWatcher],
  }
}
