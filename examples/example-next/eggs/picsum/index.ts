import type { Egg } from '@redux-eggs/redux'

import { picsumReducer } from './reducer'
import { loadPicsumWatcher } from './saga'

export const PICSUM_MODULE_NAME = 'picsum-egg' as const

export const getPicsumEgg = (): Egg => {
  return {
    id: PICSUM_MODULE_NAME,
    reducerMap: {
      [PICSUM_MODULE_NAME]: picsumReducer,
    },
    sagas: [loadPicsumWatcher],
  }
}
