import { put, takeLatest, delay } from 'redux-saga/effects'
import es6promise from 'es6-promise'
import { XkcdReducerAction } from './action-creators'
import { XkcdActionType } from './action-types'
import { XkcdLoadingState } from './state'
import { getRandomInteger } from './utils/random-integer'

es6promise.polyfill()

function* loadXkcdInfoWorker() {
  yield put(XkcdReducerAction.setLoadingState(XkcdLoadingState.LOADING))

  yield put(XkcdReducerAction.setInfo(undefined))
  yield put(XkcdReducerAction.setError(undefined))

  yield delay(1000)

  try {
    const res = yield fetch(`https://xkcd.com/${getRandomInteger(0, 1000)}/info.0.json`)

    const info = yield res.json()

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
