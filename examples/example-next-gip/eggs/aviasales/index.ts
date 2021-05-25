import type { Egg } from '@redux-eggs/redux'

import { aviasalesReducer } from '@/eggs/aviasales/reducer'
import { aviasalesSaga } from '@/eggs/aviasales/saga'

export const AVIASALES_MODULE_NAME = 'aviasales-egg' as const

export const getAviasalesEgg = (): Egg => {
  return {
    id: AVIASALES_MODULE_NAME,
    reducerMap: {
      [AVIASALES_MODULE_NAME]: aviasalesReducer,
    },
    sagas: [aviasalesSaga],
  }
}
