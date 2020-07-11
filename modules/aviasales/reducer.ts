/* eslint-disable default-case */
import produce, { Draft } from 'immer'

import { AviasalesActionsUnion } from './action-creators'
import { AviasalesActionType } from './action-types'
import { AviasalesLoadingState, AviasalesState } from './contracts/state'

const aviasalesInitialState: AviasalesState = {
  tickets: {},
  loadingState: AviasalesLoadingState.NEVER,
}

export const aviasalesReducer = produce((draft: Draft<AviasalesState>, action: AviasalesActionsUnion): void => {
  switch (action.type) {
    case AviasalesActionType.SET_SEARCH_ID:
      draft.searchId = action.payload
      break

    case AviasalesActionType.ADD_TICKETS:
      draft.tickets = Object.assign(draft.tickets, action.payload)
      break

    case AviasalesActionType.SET_LOADING_STATE:
      draft.loadingState = action.payload
      break
  }
}, aviasalesInitialState)
