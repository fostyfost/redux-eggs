import { call, delay, put, takeLatest } from 'redux-saga/effects'

import { PicsumReducerAction } from './action-creators'
import { PicsumActionType } from './action-types'
import { PicsumLoadingState } from './contracts/state'
import { fetchAsJson } from '../../utils/fetchAsJson'
import { Picture } from './contracts/picture'

function* loadPicsumWorker() {
  yield put(PicsumReducerAction.setLoadingState(PicsumLoadingState.LOADING))

  yield delay(1000)

  try {
    const pics: Picture[] = yield call(fetchAsJson, 'https://picsum.photos/v2/list')

    yield put(PicsumReducerAction.setPics(pics))
  } catch (err) {
    yield put(PicsumReducerAction.setError(err.message))
  } finally {
    yield put(PicsumReducerAction.setLoadingState(PicsumLoadingState.LOADED))
  }
}

export function* loadPicsumWatcher() {
  yield takeLatest(PicsumActionType.LOAD_PICS, loadPicsumWorker)
}
