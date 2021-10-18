import type { Immutable } from 'immer'
import { createSelector } from 'reselect'

import type { XkcdInfo } from '@/eggs/xkcd/contracts/api-response'
import type { XkcdAwareState } from '@/eggs/xkcd/contracts/state'
import { XkcdLoadingState } from '@/eggs/xkcd/contracts/state'
import { XKCD_SLICE } from '@/eggs/xkcd/slice'

export const xkcdInfoSelector = (state: XkcdAwareState): Immutable<XkcdInfo> | undefined => {
  return state[XKCD_SLICE].info
}

export const xkcdInfoTitleSelector = (state: XkcdAwareState): string | undefined => {
  return state[XKCD_SLICE].info?.title
}

export const xkcdInfoNumSelector = (state: XkcdAwareState): number | undefined => {
  return state[XKCD_SLICE].info?.num
}

export const errorSelector = (state: XkcdAwareState): string | undefined => {
  return state[XKCD_SLICE].error
}

export const loadingStateSelector = (state: XkcdAwareState): XkcdLoadingState => {
  return state[XKCD_SLICE].loadingState
}

export const isXkcdInfoLoading = createSelector(loadingStateSelector, (loadingState: XkcdLoadingState): boolean => {
  return loadingState === XkcdLoadingState.LOADING
})

export const isXkcdInfoLoaded = createSelector(loadingStateSelector, (loadingState: XkcdLoadingState): boolean => {
  return loadingState === XkcdLoadingState.LOADED
})
