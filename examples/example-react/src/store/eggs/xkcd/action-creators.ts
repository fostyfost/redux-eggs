import { fetchAsJson } from '../../../utils/fetch-as-json'
import { wait } from '../../../utils/wait'
import type { ActionsUnion } from '../../action-helper'
import { createAction } from '../../action-helper'
import type { AppThunk } from '../../index'
import { XkcdActionType } from './action-types'
import type { XkcdInfo } from './contracts/api-response'
import { XkcdLoadingState } from './contracts/state'

export type XkcdActionsUnion = ActionsUnion<typeof XkcdReducerAction>

export const XkcdReducerAction = {
  setInfo(payload: XkcdInfo | undefined) {
    return createAction(XkcdActionType.SET_INFO, payload)
  },
  setLoadingState(payload: XkcdLoadingState) {
    return createAction(XkcdActionType.SET_LOADING_STATE, payload)
  },
}

const getRandomInteger = (min: number, max: number) => Math.round(min - 0.5 + Math.random() * (max - min + 1))

export const loadXkcdInfo = (): AppThunk => {
  return async dispatch => {
    dispatch(XkcdReducerAction.setLoadingState(XkcdLoadingState.LOADING))

    await wait()

    try {
      // Alternative api https://xkcd.com/${getRandomInteger(0, 1000)}/info.0.json
      const info = await fetchAsJson<XkcdInfo>(`https://xkcd.vercel.app/?comic=${getRandomInteger(0, 1000)}`)

      dispatch(XkcdReducerAction.setInfo(info))
    } catch (error: any) {
      console.error(error)
    }

    dispatch(XkcdReducerAction.setLoadingState(XkcdLoadingState.LOADED))
  }
}
