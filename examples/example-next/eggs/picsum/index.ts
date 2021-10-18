import type { Egg } from '@redux-eggs/redux'

import { PICSUM_REDUCER_KEY, picsumReducer } from '@/eggs/picsum/reducer'
import { loadPicsumWatcher } from '@/eggs/picsum/saga'

export const getPicsumEgg = (): Egg => {
  return {
    id: 'picsum',
    reducerMap: {
      [PICSUM_REDUCER_KEY]: picsumReducer,
    },
    sagas: [loadPicsumWatcher],
  }
}
