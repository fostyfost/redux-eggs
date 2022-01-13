import type { Egg } from '@redux-eggs/core'

import { loadXkcdInfoWatcher } from '@/eggs/xkcd/saga'
import { XKCD_SLICE, XkcdPublicAction, xkcdReducer } from '@/eggs/xkcd/slice'
import type { AppStore } from '@/store'

export const getXkcdEgg = (): Egg<AppStore> => {
  const egg: Egg<AppStore> = {
    id: 'xkcd',
    reducersMap: {
      [XKCD_SLICE]: xkcdReducer,
    },
    sagas: [loadXkcdInfoWatcher],
  }

  if (typeof window === 'undefined') {
    egg.afterAdd = store => store.dispatch(XkcdPublicAction.loadInfo())
  }

  return egg
}
