import type { Egg } from '@redux-eggs/redux'

import { activePostReducer } from './reducer'
import { loadActivePostWatcher } from './saga'

export const ACTIVE_POST_MODULE_NAME = 'active-post-egg' as const

export const getActivePostEgg = (): Egg => {
  return {
    id: ACTIVE_POST_MODULE_NAME,
    reducerMap: {
      [ACTIVE_POST_MODULE_NAME]: activePostReducer,
    },
    sagas: [loadActivePostWatcher],
  }
}
