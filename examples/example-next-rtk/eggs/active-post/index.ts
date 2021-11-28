import type { Egg } from '@redux-eggs/core'

import { loadActivePostWatcher } from '@/eggs/active-post/saga'
import { ACTIVE_POST_SLICE, activePostReducer } from '@/eggs/active-post/slice'
import type { AppStore } from '@/store'

export const getActivePostEgg = (): Egg<AppStore> => {
  return {
    id: 'active-post',
    reducersMap: {
      [ACTIVE_POST_SLICE]: activePostReducer,
    },
    sagas: [loadActivePostWatcher],
  }
}
