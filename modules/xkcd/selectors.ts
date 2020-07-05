import { createSelector } from 'reselect'

import { XKCD_MODULE_NAME } from './index'
import { XkcdAwareState, XkcdLoadingState } from './contracts/state'
import { XkcdInfo } from './contracts/api-response'
import { Immutable } from 'immer'

export const xkcdInfoSelector = (state: XkcdAwareState): Immutable<XkcdInfo> | undefined => {
  return state[XKCD_MODULE_NAME].info
}

export const xkcdInfoTitleSelector = (state: XkcdAwareState): string | undefined => {
  return state[XKCD_MODULE_NAME].info?.title
}

export const xkcdInfoNumSelector = (state: XkcdAwareState): number | undefined => {
  return state[XKCD_MODULE_NAME].info?.num
}

export const errorSelector = (state: XkcdAwareState): string | undefined => {
  return state[XKCD_MODULE_NAME].error
}

export const loadingStateSelector = (state: XkcdAwareState): XkcdLoadingState => {
  return state[XKCD_MODULE_NAME].loadingState
}

export const isXkcdInfoLoading = createSelector(loadingStateSelector, (loadingState: XkcdLoadingState): boolean => {
  return loadingState === XkcdLoadingState.LOADING
})

export const isXkcdInfoLoaded = createSelector(loadingStateSelector, (loadingState: XkcdLoadingState): boolean => {
  return loadingState === XkcdLoadingState.LOADED
})
