import type { Egg } from '@redux-eggs/core'

import { PICSUM_REDUCER_KEY, picsumReducer } from '@/eggs/picsum/reducer'
import { loadPicsumWatcher } from '@/eggs/picsum/saga'
import type { AppStore } from '@/store'

export const getPicsumEgg = (): Egg<AppStore> => {
  return {
    id: 'picsum',
    reducersMap: {
      [PICSUM_REDUCER_KEY]: picsumReducer,
    },
    sagas: [loadPicsumWatcher],
  }
}
