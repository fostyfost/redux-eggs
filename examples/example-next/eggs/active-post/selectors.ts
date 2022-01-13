import { createSelector } from 'reselect'

import type { ActivePost, ActivePostAwareState } from '@/eggs/active-post/contracts/state'
import { ActivePostLoadingState } from '@/eggs/active-post/contracts/state'
import { ACTIVE_POST_REDUCER_KEY } from '@/eggs/active-post/reducer'

export const activePostSelector = (state: ActivePostAwareState): ActivePost | undefined => {
  return state[ACTIVE_POST_REDUCER_KEY].activePost
}

export const errorSelector = (state: ActivePostAwareState): string | undefined => {
  return state[ACTIVE_POST_REDUCER_KEY].error
}

export const loadingStateSelector = (state: ActivePostAwareState): ActivePostLoadingState => {
  return state[ACTIVE_POST_REDUCER_KEY].loadingState
}

export const isActivePostLoading = createSelector(
  loadingStateSelector,
  (loadingState: ActivePostLoadingState): boolean => loadingState === ActivePostLoadingState.LOADING,
)

export const isActivePostLoaded = createSelector(
  loadingStateSelector,
  (loadingState: ActivePostLoadingState): boolean => loadingState === ActivePostLoadingState.LOADED,
)
