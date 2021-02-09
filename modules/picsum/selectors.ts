import type { Immutable } from 'immer'
import { createSelector } from 'reselect'

import type { Picture } from './contracts/picture'
import type { PicsumAwareState } from './contracts/state'
import { PicsumLoadingState } from './contracts/state'
import { PICSUM_MODULE_NAME } from './index'

export const picsSelector = (state: PicsumAwareState): Immutable<Picture[]> | undefined => {
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
