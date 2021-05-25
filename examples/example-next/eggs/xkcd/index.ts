import type { Egg } from '@redux-eggs/redux'

import { XkcdPublicAction } from '@/eggs/xkcd/action-creators'

import { xkcdReducer } from './reducer'
import { loadXkcdInfoWatcher } from './saga'

export const XKCD_MODULE_NAME = 'xkcd-egg' as const

export const getXkcdEgg = (): Egg => {
  return {
    id: XKCD_MODULE_NAME,
    reducerMap: {
      [XKCD_MODULE_NAME]: xkcdReducer,
    },
    sagas: [loadXkcdInfoWatcher],
    afterAdd(store) {
      if (typeof window === 'undefined') {
        store.dispatch(XkcdPublicAction.loadInfo())
      }
    },
  }
}
