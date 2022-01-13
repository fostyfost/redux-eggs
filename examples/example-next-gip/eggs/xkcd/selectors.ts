import { createSelector } from 'reselect'

import type { XkcdInfo } from '@/eggs/xkcd/contracts/api-response'
import type { XkcdAwareState } from '@/eggs/xkcd/contracts/state'
import { XkcdLoadingState } from '@/eggs/xkcd/contracts/state'
import { XKCD_REDUCER_KEY } from '@/eggs/xkcd/reducer'

export const xkcdInfoSelector = (state: XkcdAwareState): XkcdInfo | undefined => {
  return state[XKCD_REDUCER_KEY].info
}

export const xkcdInfoTitleSelector = (state: XkcdAwareState): string | undefined => {
  return state[XKCD_REDUCER_KEY].info?.title
}

export const xkcdInfoNumSelector = (state: XkcdAwareState): number | undefined => {
  return state[XKCD_REDUCER_KEY].info?.num
}

export const errorSelector = (state: XkcdAwareState): string | undefined => {
  return state[XKCD_REDUCER_KEY].error
}

export const loadingStateSelector = (state: XkcdAwareState): XkcdLoadingState => {
  return state[XKCD_REDUCER_KEY].loadingState
}

export const isXkcdInfoLoading = createSelector(
  loadingStateSelector,
  (loadingState: XkcdLoadingState): boolean => loadingState === XkcdLoadingState.LOADING,
)

export const isXkcdInfoLoaded = createSelector(
  loadingStateSelector,
  (loadingState: XkcdLoadingState): boolean => loadingState === XkcdLoadingState.LOADED,
)
