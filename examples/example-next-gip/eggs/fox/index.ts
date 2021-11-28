import type { Egg } from '@redux-eggs/core'

import { FOX_REDUCER_KEY, foxReducer } from '@/eggs/fox/reducer'
import { loadFoxWatcher } from '@/eggs/fox/saga'
import type { AppStore } from '@/store'

export const getFoxEgg = (): Egg<AppStore> => {
  return {
    id: 'fox',
    reducersMap: {
      [FOX_REDUCER_KEY]: foxReducer,
    },
    sagas: [loadFoxWatcher],
  }
}
