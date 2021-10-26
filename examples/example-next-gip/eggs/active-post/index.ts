import type { Egg } from '@redux-eggs/core'

import { ACTIVE_POST_REDUCER_KEY, activePostReducer } from '@/eggs/active-post/reducer'
import { loadActivePostWatcher } from '@/eggs/active-post/saga'

export const getActivePostEgg = (): Egg => {
  return {
    id: 'active-post',
    reducerMap: {
      [ACTIVE_POST_REDUCER_KEY]: activePostReducer,
    },
    sagas: [loadActivePostWatcher],
  }
}
