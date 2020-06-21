import { createSelector } from 'reselect'

import { PICSUM_MODULE_NAME } from './index'
import { PicsumAwareState, PicsumLoadingState } from './state'

export const picsSelector = (state: PicsumAwareState): any[] | undefined => {
  return state[PICSUM_MODULE_NAME].pics
}

export const errorSelector = (state: PicsumAwareState): string | undefined => {
  return state[PICSUM_MODULE_NAME].error
}

export const loadingStateSelector = (state: PicsumAwareState): PicsumLoadingState => {
  return state[PICSUM_MODULE_NAME].loadingState
}

export const isPicsLoading = createSelector(loadingStateSelector, (loadingState: PicsumLoadingState): boolean => {
  return loadingState === PicsumLoadingState.LOADING
})
