import type { Egg } from '@redux-eggs/redux-toolkit'

import { loadPicsumWatcher } from '@/eggs/picsum/saga'
import { PICSUM_SLICE, picsumReducer } from '@/eggs/picsum/slice'

export const getPicsumEgg = (): Egg => {
  return {
    id: 'picsum',
    reducerMap: {
      [PICSUM_SLICE]: picsumReducer,
    },
    sagas: [loadPicsumWatcher],
  }
}
