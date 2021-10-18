import type { Egg } from '@redux-eggs/redux'

import { DOG_REDUCER_KEY, dogReducer } from '@/eggs/dog/reducer'
import { loadDogWatcher } from '@/eggs/dog/saga'

export const getDogEgg = (): Egg => {
  return {
    id: 'dog',
    reducerMap: {
      [DOG_REDUCER_KEY]: dogReducer,
    },
    sagas: [loadDogWatcher],
  }
}
