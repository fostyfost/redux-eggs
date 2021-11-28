import type { Egg } from '@redux-eggs/core'

import { loadDogWatcher } from '@/eggs/dog/saga'
import { DOG_SLICE, dogReducer } from '@/eggs/dog/slice'
import type { AppStore } from '@/store'

export const getDogEgg = (): Egg<AppStore> => {
  return {
    id: 'dog',
    reducersMap: {
      [DOG_SLICE]: dogReducer,
    },
    sagas: [loadDogWatcher],
  }
}
