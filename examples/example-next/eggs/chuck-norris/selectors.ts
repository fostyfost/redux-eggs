import { createSelector } from 'reselect'

import type { ChuckNorrisAwareState } from '@/eggs/chuck-norris/contracts/state'
import { ChuckNorrisLoadingState } from '@/eggs/chuck-norris/contracts/state'
import { CHUCK_NORRIS_REDUCER_KEY } from '@/eggs/chuck-norris/reducer'

export const jokeSelector = (state: ChuckNorrisAwareState): string | undefined => {
  return state[CHUCK_NORRIS_REDUCER_KEY].joke
}

export const errorSelector = (state: ChuckNorrisAwareState): string | undefined => {
  return state[CHUCK_NORRIS_REDUCER_KEY].error
}

export const loadingStateSelector = (state: ChuckNorrisAwareState): ChuckNorrisLoadingState => {
  return state[CHUCK_NORRIS_REDUCER_KEY].loadingState
}

export const isJokeLoading = createSelector(
  loadingStateSelector,
  (loadingState: ChuckNorrisLoadingState): boolean => loadingState === ChuckNorrisLoadingState.LOADING,
)
