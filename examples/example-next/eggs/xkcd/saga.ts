import { call, put, select, takeLatest } from 'redux-saga/effects'

import { fetchAsJson } from '@/utils/fetchAsJson'

import { XkcdReducerAction } from './action-creators'
import { XkcdActionType } from './action-types'
import type { XkcdInfo } from './contracts/api-response'
import { XkcdLoadingState } from './contracts/state'
import { errorSelector, xkcdInfoSelector } from './selectors'
import { getRandomInteger } from './utils/random-integer'

function* loadXkcdInfoWorker() {
  yield put(XkcdReducerAction.setLoadingState(XkcdLoadingState.LOADING))

  const currentInfo: ReturnType<typeof xkcdInfoSelector> = yield select(xkcdInfoSelector)

  if (currentInfo) {
    yield put(XkcdReducerAction.setInfo(undefined))
  }

  const error: ReturnType<typeof errorSelector> = yield select(errorSelector)

  if (error) {
    yield put(XkcdReducerAction.setError(undefined))
  }

  try {
    // Alternative api https://xkcd.com/${getRandomInteger(0, 1000)}/info.0.json
    const info: XkcdInfo = yield call(fetchAsJson, `https://xkcd.now.sh/?comic=${getRandomInteger(0, 1000)}`)

    yield put(XkcdReducerAction.setInfo(info))
  } catch (error: any) {
    console.error('[Error in `loadXkcdInfoWorker`]', error)
    yield put(XkcdReducerAction.setError(error.message))
  } finally {
    yield put(XkcdReducerAction.setLoadingState(XkcdLoadingState.LOADED))
  }
}

export function* loadXkcdInfoWatcher() {
  yield takeLatest(XkcdActionType.LOAD_INFO, loadXkcdInfoWorker)
}
