import type { Egg } from '@redux-eggs/core'

import { loadFoxWatcher } from '@/eggs/fox/saga'
import { FOX_SLICE, foxReducer } from '@/eggs/fox/slice'
import type { AppStore } from '@/store'

export const getFoxEgg = (): Egg<AppStore> => {
  return {
    id: 'fox',
    reducersMap: {
      [FOX_SLICE]: foxReducer,
    },
    sagas: [loadFoxWatcher],
  }
}
