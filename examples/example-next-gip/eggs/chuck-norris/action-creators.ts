import { ChuckNorrisActionType } from '@/eggs/chuck-norris/action-types'
import type { ChuckNorrisLoadingState } from '@/eggs/chuck-norris/contracts/state'
import type { ActionsUnion } from '@/store/action-helper'
import { createAction } from '@/store/action-helper'

export const ChuckNorrisPublicAction = {
  loadJoke() {
    return createAction(ChuckNorrisActionType.LOAD_JOKE)
  },
}

export const ChuckNorrisReducerAction = {
  setJoke(payload: string) {
    return createAction(ChuckNorrisActionType.SET_JOKE, payload)
  },
  setError(payload: string | undefined) {
    return createAction(ChuckNorrisActionType.SET_ERROR, payload)
  },
  setLoadingState(payload: ChuckNorrisLoadingState) {
    return createAction(ChuckNorrisActionType.SET_LOADING_STATE, payload)
  },
}

export type ChuckNorrisActionsUnion = ActionsUnion<typeof ChuckNorrisReducerAction>
