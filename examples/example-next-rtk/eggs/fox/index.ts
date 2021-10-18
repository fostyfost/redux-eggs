import type { Egg } from '@redux-eggs/redux-toolkit'

import { loadFoxWatcher } from '@/eggs/fox/saga'
import { FOX_SLICE, foxReducer } from '@/eggs/fox/slice'

export const getFoxEgg = (): Egg => {
  return {
    id: 'fox',
    reducerMap: {
      [FOX_SLICE]: foxReducer,
    },
    sagas: [loadFoxWatcher],
  }
}
