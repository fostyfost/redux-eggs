import type { Egg } from '@redux-eggs/core'

import { AVIASALES_REDUCER_KEY, aviasalesReducer } from '@/eggs/aviasales/reducer'
import { aviasalesSaga } from '@/eggs/aviasales/saga'
import type { AppStore } from '@/store'

export const getAviasalesEgg = (): Egg<AppStore> => {
  return {
    id: 'aviasales',
    reducersMap: {
      [AVIASALES_REDUCER_KEY]: aviasalesReducer,
    },
    sagas: [aviasalesSaga],
  }
}
