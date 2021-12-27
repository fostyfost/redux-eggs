import type { Egg } from '@redux-eggs/core'

import type { AppStore } from '../../index'
import { loadDog } from './action-creators'
import { DOG_REDUCER_KEY, dogReducer } from './reducer'

export const getDogEgg = (): Egg<AppStore> => {
  return {
    id: 'dog',
    reducersMap: {
      [DOG_REDUCER_KEY]: dogReducer,
    },
    afterAdd(store) {
      store.dispatch(loadDog())
    },
  }
}
