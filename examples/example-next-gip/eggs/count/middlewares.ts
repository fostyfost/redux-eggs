import type { Middleware } from 'redux'

import { COUNT_REDUCER_KEY } from '@/eggs/count/reducer'
import { countSelector } from '@/eggs/count/selectors'
import { StoreActionType } from '@/store/action-types'

export const skipHydration: Middleware = store => next => action => {
  if (action.type === StoreActionType.HYDRATE && countSelector(store.getState())) {
    delete action.payload[COUNT_REDUCER_KEY]
  }

  next(action)
}
