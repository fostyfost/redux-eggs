import { createSelector } from '@reduxjs/toolkit'

import type { ChuckNorrisAwareState } from '@/eggs/chuck-norris/contracts/state'
import { ChuckNorrisLoadingState } from '@/eggs/chuck-norris/contracts/state'
import { CHUCK_NORRIS_SLICE } from '@/eggs/chuck-norris/slice'

export const jokeSelector = (state: ChuckNorrisAwareState): string | undefined => {
  return state[CHUCK_NORRIS_SLICE].joke
}

export const errorSelector = (state: ChuckNorrisAwareState): string | undefined => {
  return state[CHUCK_NORRIS_SLICE].error
}

export const loadingStateSelector = (state: ChuckNorrisAwareState): ChuckNorrisLoadingState => {
  return state[CHUCK_NORRIS_SLICE].loadingState
}

export const isJokeLoading = createSelector(loadingStateSelector, (loadingState: ChuckNorrisLoadingState): boolean => {
  return loadingState === ChuckNorrisLoadingState.LOADING
})
