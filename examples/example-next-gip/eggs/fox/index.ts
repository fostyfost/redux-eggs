import type { Egg } from '@redux-eggs/core'

import { FOX_REDUCER_KEY, foxReducer } from '@/eggs/fox/reducer'
import { loadFoxWatcher } from '@/eggs/fox/saga'

export const getFoxEgg = (): Egg => {
  return {
    id: 'fox',
    reducerMap: {
      [FOX_REDUCER_KEY]: foxReducer,
    },
    sagas: [loadFoxWatcher],
  }
}
