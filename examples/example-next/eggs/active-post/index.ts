import type { Egg } from '@redux-eggs/core'

import { ACTIVE_POST_REDUCER_KEY, activePostReducer } from '@/eggs/active-post/reducer'
import { loadActivePostWatcher } from '@/eggs/active-post/saga'
import type { AppStore } from '@/store'

export const getActivePostEgg = (): Egg<AppStore> => {
  return {
    id: 'active-post',
    reducersMap: {
      [ACTIVE_POST_REDUCER_KEY]: activePostReducer,
    },
    sagas: [loadActivePostWatcher],
  }
}
