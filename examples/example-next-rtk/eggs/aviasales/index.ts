import type { Egg } from '@redux-eggs/core'

import { aviasalesSaga } from '@/eggs/aviasales/saga'
import { AVIASALES_SLICE, aviasalesReducer } from '@/eggs/aviasales/slice'
import type { AppStore } from '@/store'

export const getAviasalesEgg = (): Egg<AppStore> => {
  return {
    id: 'aviasales',
    reducersMap: {
      [AVIASALES_SLICE]: aviasalesReducer,
    },
    sagas: [aviasalesSaga],
  }
}
