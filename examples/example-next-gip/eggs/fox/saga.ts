import { call, put, select, takeLatest } from 'redux-saga/effects'

import { FoxReducerAction } from '@/eggs/fox/action-creators'
import { FoxActionType } from '@/eggs/fox/action-types'
import type { FoxResponse } from '@/eggs/fox/contracts/api-response'
import { FoxLoadingState } from '@/eggs/fox/contracts/state'
import { errorSelector } from '@/eggs/fox/selectors'
import { fetchAsJson } from '@/utils/fetch-as-json'

function* loadFoxWorker() {
  yield put(FoxReducerAction.setLoadingState(FoxLoadingState.LOADING))

  const error: ReturnType<typeof errorSelector> = yield select(errorSelector)

  if (error) {
    yield put(FoxReducerAction.setError(undefined))
  }

  try {
    const res: FoxResponse = yield call(() => {
      return fetchAsJson<FoxResponse>('https://randomfox.ca/floof/')
    })

    yield put(FoxReducerAction.setFox(res.image))
  } catch (error: any) {
    console.error('[Error in `loadFoxWorker`]', error)
    yield put(FoxReducerAction.setError(error.message))
  } finally {
    yield put(FoxReducerAction.setLoadingState(FoxLoadingState.LOADED))
  }
}

export function* loadFoxWatcher() {
  yield takeLatest(FoxActionType.LOAD_FOX, loadFoxWorker)
}
