import type { Egg } from '@redux-eggs/core'

import { DOG_REDUCER_KEY, dogReducer } from '@/eggs/dog/reducer'
import { loadDogWatcher } from '@/eggs/dog/saga'
import type { AppStore } from '@/store'

export const getDogEgg = (): Egg<AppStore> => {
  return {
    id: 'dog',
    reducersMap: {
      [DOG_REDUCER_KEY]: dogReducer,
    },
    sagas: [loadDogWatcher],
  }
}
