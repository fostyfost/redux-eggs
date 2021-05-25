import type { Egg } from '@redux-eggs/redux'

import { foxReducer } from './reducer'
import { loadFoxWatcher } from './saga'

export const FOX_MODULE_NAME = 'fox-egg' as const

export const getFoxEgg = (): Egg => {
  return {
    id: FOX_MODULE_NAME,
    reducerMap: {
      [FOX_MODULE_NAME]: foxReducer,
    },
    sagas: [loadFoxWatcher],
  }
}
