import type { Egg } from '@redux-eggs/core'

import { loadPicsumWatcher } from '@/eggs/picsum/saga'
import { PICSUM_SLICE, picsumReducer } from '@/eggs/picsum/slice'
import type { AppStore } from '@/store'

export const getPicsumEgg = (): Egg<AppStore> => {
  return {
    id: 'picsum',
    reducersMap: {
      [PICSUM_SLICE]: picsumReducer,
    },
    sagas: [loadPicsumWatcher],
  }
}
