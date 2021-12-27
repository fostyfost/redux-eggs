import { fetchAsJson } from '../../../utils/fetch-as-json'
import { wait } from '../../../utils/wait'
import type { ActionsUnion } from '../../action-helper'
import { createAction } from '../../action-helper'
import type { AppThunk } from '../../index'
import { DogActionType } from './action-types'
import type { DogResponse } from './contracts/api-response'
import { DogLoadingState } from './contracts/state'

export type DogActionsUnion = ActionsUnion<typeof DogReducerAction>

export const DogReducerAction = {
  setDog(payload: string) {
    return createAction(DogActionType.SET_DOG, payload)
  },
  setLoadingState(payload: DogLoadingState) {
    return createAction(DogActionType.SET_LOADING_STATE, payload)
  },
}

export const loadDog = (): AppThunk => {
  return async dispatch => {
    dispatch(DogReducerAction.setLoadingState(DogLoadingState.LOADING))

    await wait()

    try {
      const res = await fetchAsJson<DogResponse>('https://dog.ceo/api/breeds/image/random')

      dispatch(DogReducerAction.setDog(res.message))
    } catch (error: any) {
      console.error(error)
    }

    dispatch(DogReducerAction.setLoadingState(DogLoadingState.LOADED))
  }
}
