import type { Egg } from '@redux-eggs/core'

import { AVIASALES_REDUCER_KEY, aviasalesReducer } from '@/eggs/aviasales/reducer'
import { aviasalesSaga } from '@/eggs/aviasales/saga'

export const getAviasalesEgg = (): Egg => {
  return {
    id: 'aviasales',
    reducerMap: {
      [AVIASALES_REDUCER_KEY]: aviasalesReducer,
    },
    sagas: [aviasalesSaga],
  }
}
