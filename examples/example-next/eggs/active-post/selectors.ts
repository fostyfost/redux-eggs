import type { Immutable } from 'immer'
import { createSelector } from 'reselect'

import type { ActivePost, ActivePostAwareState } from './contracts/state'
import { ActivePostLoadingState } from './contracts/state'
import { ACTIVE_POST_MODULE_NAME } from './index'

export const activePostSelector = (state: ActivePostAwareState): Immutable<ActivePost> | undefined => {
  return state[ACTIVE_POST_MODULE_NAME].activePost
}

export const errorSelector = (state: ActivePostAwareState): string | undefined => {
  return state[ACTIVE_POST_MODULE_NAME].error
}

export const loadingStateSelector = (state: ActivePostAwareState): ActivePostLoadingState => {
  return state[ACTIVE_POST_MODULE_NAME].loadingState
}

export const isActivePostLoading = createSelector(
  loadingStateSelector,
  (loadingState: ActivePostLoadingState): boolean => {
    return loadingState === ActivePostLoadingState.LOADING
  },
)

export const isActivePostLoaded = createSelector(
  loadingStateSelector,
  (loadingState: ActivePostLoadingState): boolean => {
    return loadingState === ActivePostLoadingState.LOADED
  },
)
