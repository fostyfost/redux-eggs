import { call, delay, put, takeLatest } from 'redux-saga/effects'

import { XkcdReducerAction } from './action-creators'
import { XkcdActionType } from './action-types'
import { XkcdLoadingState } from './contracts/state'
import { getRandomInteger } from './utils/random-integer'
import { fetchAsJson } from '../../utils/fetchAsJson'

function* loadXkcdInfoWorker() {
  yield put(XkcdReducerAction.setLoadingState(XkcdLoadingState.LOADING))

  yield put(XkcdReducerAction.setInfo(undefined))
  yield put(XkcdReducerAction.setError(undefined))

  yield delay(1000)

  try {
    // Alternative api https://xkcd.com/${getRandomInteger(0, 1000)}/info.0.json
    const info = yield call(fetchAsJson, `https://xkcd.now.sh/?comic=${getRandomInteger(0, 1000)}`)

    yield put(XkcdReducerAction.setInfo(info))
  } catch (err) {
    yield put(XkcdReducerAction.setError(err.message))
  } finally {
    yield put(XkcdReducerAction.setLoadingState(XkcdLoadingState.LOADED))
  }
}

export function* loadXkcdInfoWatcher() {
  yield takeLatest(XkcdActionType.LOAD_INFO, loadXkcdInfoWorker)
}
