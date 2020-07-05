import { ActionsUnion, createAction } from '../../store/action-helper'
import { ChuckNorrisActionType } from './action-types'
import { ChuckNorrisLoadingState } from './contracts/state'

export const ChuckNorrisPublicAction = {
  loadJoke: () => createAction(ChuckNorrisActionType.LOAD_JOKE),
}

export const ChuckNorrisReducerAction = {
  setJoke: (payload: any) => createAction(ChuckNorrisActionType.SET_JOKE, payload),
  setError: (payload: string) => createAction(ChuckNorrisActionType.SET_ERROR, payload),
  setLoadingState: (payload: ChuckNorrisLoadingState) => createAction(ChuckNorrisActionType.SET_LOADING_STATE, payload),
}

export type ChuckNorrisActionsUnion = ActionsUnion<typeof ChuckNorrisReducerAction>
