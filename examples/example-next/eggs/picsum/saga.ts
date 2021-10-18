import { call, put, select, takeLatest } from 'redux-saga/effects'

import { PicsumReducerAction } from '@/eggs/picsum/action-creators'
import { PicsumActionType } from '@/eggs/picsum/action-types'
import type { Picture } from '@/eggs/picsum/contracts/picture'
import { PicsumLoadingState } from '@/eggs/picsum/contracts/state'
import { errorSelector } from '@/eggs/picsum/selectors'
import { fetchAsJson } from '@/utils/fetch-as-json'

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
