import type { Egg } from '@redux-eggs/core'

import { loadXkcdInfoWatcher } from '@/eggs/xkcd/saga'
import { XKCD_SLICE, XkcdPublicAction, xkcdReducer } from '@/eggs/xkcd/slice'
import type { AppStore } from '@/store'

export const getXkcdEgg = (): Egg<AppStore> => {
  return {
    id: 'xkcd',
    reducersMap: {
      [XKCD_SLICE]: xkcdReducer,
    },
    sagas: [loadXkcdInfoWatcher],
    afterAdd(store) {
      if (typeof window === 'undefined') {
        store.dispatch(XkcdPublicAction.loadInfo())
      }
    },
  }
}
