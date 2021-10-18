import type { Immutable } from 'immer'
import { createSelector } from 'reselect'

import type { ActivePost, ActivePostAwareState } from '@/eggs/active-post/contracts/state'
import { ActivePostLoadingState } from '@/eggs/active-post/contracts/state'
import { ACTIVE_POST_SLICE } from '@/eggs/active-post/slice'

export const activePostSelector = (state: ActivePostAwareState): Immutable<ActivePost> | undefined => {
  return state[ACTIVE_POST_SLICE].activePost
}

export const errorSelector = (state: ActivePostAwareState): string | undefined => {
  return state[ACTIVE_POST_SLICE].error
}

export const loadingStateSelector = (state: ActivePostAwareState): ActivePostLoadingState => {
  return state[ACTIVE_POST_SLICE].loadingState
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
