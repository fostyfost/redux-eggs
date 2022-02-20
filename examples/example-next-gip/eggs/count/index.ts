import type { Egg } from '@redux-eggs/core'

import { skipHydration } from '@/eggs/count/middlewares'
import { COUNT_REDUCER_KEY, countReducer } from '@/eggs/count/reducer'
import { countWatcher } from '@/eggs/count/saga'
import type { AppStore } from '@/store'

export const getCountEgg = (): Egg<AppStore> => {
  return {
    id: 'count',
    reducersMap: {
      [COUNT_REDUCER_KEY]: countReducer,
    },
    middlewares: [skipHydration],
    sagas: [countWatcher],
  }
}
