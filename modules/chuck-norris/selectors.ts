import { createSelector } from 'reselect'

import { CHUCK_NORRIS_MODULE_NAME } from './index'
import { ChuckNorrisAwareState, ChuckNorrisLoadingState } from './contracts/state'

export const jokeSelector = (state: ChuckNorrisAwareState): string | undefined => {
  return state[CHUCK_NORRIS_MODULE_NAME].joke
}

export const errorSelector = (state: ChuckNorrisAwareState): string | undefined => {
  return state[CHUCK_NORRIS_MODULE_NAME].error
}

export const loadingStateSelector = (state: ChuckNorrisAwareState): ChuckNorrisLoadingState => {
  return state[CHUCK_NORRIS_MODULE_NAME].loadingState
}

export const isJokeLoading = createSelector(loadingStateSelector, (loadingState: ChuckNorrisLoadingState): boolean => {
  return loadingState === ChuckNorrisLoadingState.LOADING
})
