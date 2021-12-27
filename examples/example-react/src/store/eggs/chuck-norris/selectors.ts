import { createSelector } from 'reselect'

import type { ChuckNorrisAwareState, ChuckNorrisState } from './contracts/state'
import { ChuckNorrisLoadingState } from './contracts/state'
import { CHUCK_NORRIS_REDUCER_KEY, initialState } from './reducer'

const stateSelector = (state: ChuckNorrisAwareState): ChuckNorrisState => {
  return state[CHUCK_NORRIS_REDUCER_KEY] ?? initialState
}

export const jokeSelector = (state: ChuckNorrisAwareState): string | undefined => {
  return stateSelector(state).joke
}

export const loadingStateSelector = (state: ChuckNorrisAwareState): ChuckNorrisLoadingState => {
  return stateSelector(state).loadingState
}

export const isJokeLoading = createSelector(loadingStateSelector, (loadingState: ChuckNorrisLoadingState): boolean => {
  return loadingState === ChuckNorrisLoadingState.LOADING
})
