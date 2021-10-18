import type { Egg } from '@redux-eggs/redux-toolkit'

import { aviasalesSaga } from '@/eggs/aviasales/saga'
import { AVIASALES_SLICE, aviasalesReducer } from '@/eggs/aviasales/slice'

export const getAviasalesEgg = (): Egg => {
  return {
    id: 'aviasales',
    reducerMap: {
      [AVIASALES_SLICE]: aviasalesReducer,
    },
    sagas: [aviasalesSaga],
  }
}
