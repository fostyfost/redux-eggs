import type { ActionsUnion } from '@/store/action-helper'
import { createAction } from '@/store/action-helper'

import { DogActionType } from './action-types'
import type { DogLoadingState } from './contracts/state'

export const DogPublicAction = {
  loadDog() {
    return createAction(DogActionType.LOAD_DOG)
  },
}

export const DogReducerAction = {
  setDog(payload: string) {
    return createAction(DogActionType.SET_DOG, payload)
  },
  setError(payload: string | undefined) {
    return createAction(DogActionType.SET_ERROR, payload)
  },
  setLoadingState(payload: DogLoadingState) {
    return createAction(DogActionType.SET_LOADING_STATE, payload)
  },
}

export type DogActionsUnion = ActionsUnion<typeof DogReducerAction>
