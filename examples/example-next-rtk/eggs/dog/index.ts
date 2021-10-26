import type { Egg } from '@redux-eggs/core'

import { loadDogWatcher } from '@/eggs/dog/saga'
import { DOG_SLICE, dogReducer } from '@/eggs/dog/slice'

export const getDogEgg = (): Egg => {
  return {
    id: 'dog',
    reducerMap: {
      [DOG_SLICE]: dogReducer,
    },
    sagas: [loadDogWatcher],
  }
}
