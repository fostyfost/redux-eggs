import type { Middleware } from '@reduxjs/toolkit'

import { countSelector } from '@/eggs/count/selectors'
import { COUNT_SLICE } from '@/eggs/count/slice'
import { StoreActionType } from '@/store/action-types'

export const skipHydration: Middleware = store => next => action => {
  if (action.type === StoreActionType.HYDRATE && countSelector(store.getState())) {
    delete action.payload[COUNT_SLICE]
  }

  next(action)
}
