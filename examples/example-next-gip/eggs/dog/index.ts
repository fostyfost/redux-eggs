import type { Egg } from '@redux-eggs/redux'

import { dogReducer } from './reducer'
import { loadDogWatcher } from './saga'

export const DOG_MODULE_NAME = 'dog-egg' as const

export const getDogEgg = (): Egg => {
  return {
    id: DOG_MODULE_NAME,
    reducerMap: {
      [DOG_MODULE_NAME]: dogReducer,
    },
    sagas: [loadDogWatcher],
  }
}
