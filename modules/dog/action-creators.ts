import { ActionsUnion, createAction } from '../../store/action-helper'
import { DogActionType } from './action-types'
import { DogLoadingState } from './contracts/state'

export const DogPublicAction = {
  loadDog: () => createAction(DogActionType.LOAD_DOG),
}

export const DogReducerAction = {
  setDog: (payload: string) => createAction(DogActionType.SET_DOG, payload),
  setError: (payload: string) => createAction(DogActionType.SET_ERROR, payload),
  setLoadingState: (payload: DogLoadingState) => createAction(DogActionType.SET_LOADING_STATE, payload),
}

export type DogActionsUnion = ActionsUnion<typeof DogReducerAction>
