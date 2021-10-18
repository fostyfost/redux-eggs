import type { Egg } from '@redux-eggs/redux-toolkit'

import { loadActivePostWatcher } from '@/eggs/active-post/saga'
import { ACTIVE_POST_SLICE, activePostReducer } from '@/eggs/active-post/slice'

export const getActivePostEgg = (): Egg => {
  return {
    id: 'active-post',
    reducerMap: {
      [ACTIVE_POST_SLICE]: activePostReducer,
    },
    sagas: [loadActivePostWatcher],
  }
}
