import { fetchAsJson } from '../../../utils/fetch-as-json'
import { wait } from '../../../utils/wait'
import type { ActionsUnion } from '../../action-helper'
import { createAction } from '../../action-helper'
import type { AppThunk } from '../../index'
import { ChuckNorrisActionType } from './action-types'
import type { JokeResponse } from './contracts/api-response'
import { ChuckNorrisLoadingState } from './contracts/state'

export type ChuckNorrisActionsUnion = ActionsUnion<typeof ChuckNorrisReducerAction>

export const ChuckNorrisReducerAction = {
  setJoke(payload: string) {
    return createAction(ChuckNorrisActionType.SET_JOKE, payload)
  },
  setLoadingState(payload: ChuckNorrisLoadingState) {
    return createAction(ChuckNorrisActionType.SET_LOADING_STATE, payload)
  },
}

export const loadJoke = (): AppThunk => {
  return async dispatch => {
    dispatch(ChuckNorrisReducerAction.setLoadingState(ChuckNorrisLoadingState.LOADING))

    await wait()

    try {
      const joke = await fetchAsJson<JokeResponse>('https://api.chucknorris.io/jokes/random')

      dispatch(ChuckNorrisReducerAction.setJoke(joke.value))
    } catch (error: any) {
      console.error(error)
    }

    dispatch(ChuckNorrisReducerAction.setLoadingState(ChuckNorrisLoadingState.LOADED))
  }
}
