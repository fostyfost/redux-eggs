import { call, put, select, takeLatest } from 'redux-saga/effects'

import { fetchAsJson } from '@/utils/fetchAsJson'

import { PicsumReducerAction } from './action-creators'
import { PicsumActionType } from './action-types'
import type { Picture } from './contracts/picture'
import { PicsumLoadingState } from './contracts/state'
import { errorSelector } from './selectors'

function* loadPicsumWorker() {
  yield put(PicsumReducerAction.setLoadingState(PicsumLoadingState.LOADING))

  const error: ReturnType<typeof errorSelector> = yield select(errorSelector)

  if (error) {
    yield put(PicsumReducerAction.setError(undefined))
  }

  try {
    const pics: Picture[] = yield call(fetchAsJson, 'https://picsum.photos/v2/list')

    yield put(PicsumReducerAction.setPics(pics))
  } catch (error: any) {
    console.error('[Error in `loadPicsumWorker`]', error)
    yield put(PicsumReducerAction.setError(error.message))
  } finally {
    yield put(PicsumReducerAction.setLoadingState(PicsumLoadingState.LOADED))
  }
}

export function* loadPicsumWatcher() {
  yield takeLatest(PicsumActionType.LOAD_PICS, loadPicsumWorker)
}
