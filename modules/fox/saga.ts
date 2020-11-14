import { call, delay, put, takeLatest } from 'redux-saga/effects'

import { fetchAsJson } from '@/utils/fetchAsJson'

import { FoxReducerAction } from './action-creators'
import { FoxActionType } from './action-types'
import { FoxResponse } from './contracts/api-response'
import { FoxLoadingState } from './contracts/state'

function* loadFoxWorker() {
  yield put(FoxReducerAction.setLoadingState(FoxLoadingState.LOADING))

  yield put(FoxReducerAction.setError(undefined))

  yield delay(1000)

  try {
    const res: FoxResponse = yield call(fetchAsJson, 'https://randomfox.ca/floof/')

    yield put(FoxReducerAction.setFox(res.image))
  } catch (err) {
    yield put(FoxReducerAction.setError(err.message))
  } finally {
    yield put(FoxReducerAction.setLoadingState(FoxLoadingState.LOADED))
  }
}

export function* loadFoxWatcher() {
  yield takeLatest(FoxActionType.LOAD_FOX, loadFoxWorker)
}
