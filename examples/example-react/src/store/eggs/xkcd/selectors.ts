import { createSelector } from 'reselect'

import type { XkcdInfo } from './contracts/api-response'
import type { XkcdAwareState, XkcdState } from './contracts/state'
import { XkcdLoadingState } from './contracts/state'
import { initialState, XKCD_REDUCER_KEY } from './reducer'

const stateSelector = (state: XkcdAwareState): XkcdState => {
  return state[XKCD_REDUCER_KEY] ?? initialState
}

export const xkcdInfoSelector = (state: XkcdAwareState): XkcdInfo | undefined => {
  return stateSelector(state).info
}

export const loadingStateSelector = (state: XkcdAwareState): XkcdLoadingState => {
  return stateSelector(state).loadingState
}

export const isXkcdInfoLoading = createSelector(
  loadingStateSelector,
  (loadingState: XkcdLoadingState): boolean => loadingState === XkcdLoadingState.LOADING,
)
