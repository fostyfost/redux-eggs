import type { Egg } from '@redux-eggs/core'

import type { AppStore } from '../../index'
import { loadXkcdInfo } from './action-creators'
import { XKCD_REDUCER_KEY, xkcdReducer } from './reducer'

export const getXkcdEgg = (): Egg<AppStore> => {
  return {
    id: 'xkcd',
    reducersMap: {
      [XKCD_REDUCER_KEY]: xkcdReducer,
    },
    afterAdd(store) {
      store.dispatch(loadXkcdInfo())
    },
  }
}
