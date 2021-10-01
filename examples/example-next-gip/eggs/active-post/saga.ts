import { call, put, select, takeLatest } from 'redux-saga/effects'

import { fetchAsJson } from '@/utils/fetchAsJson'

import type { ActivePostPublicAction } from './action-creators'
import { ActivePostReducerAction } from './action-creators'
import { ActivePostActionType } from './action-types'
import type { ActivePostResponseItem } from './contracts/api-response'
import { ActivePostLoadingState } from './contracts/state'
import { errorSelector } from './selectors'

function* loadActivePostWorker({ payload }: ReturnType<typeof ActivePostPublicAction.loadActivePost>) {
  yield put(ActivePostReducerAction.setLoadingState(ActivePostLoadingState.LOADING))

  const error: ReturnType<typeof errorSelector> = yield select(errorSelector)

  if (error) {
    yield put(ActivePostReducerAction.setError(undefined))
  }

  try {
    const response: ActivePostResponseItem = yield call(
      fetchAsJson,
      typeof window === 'undefined'
        ? `http://localhost:${process.env.PORT}/api/posts/${payload}`
        : `/api/posts/${payload}`,
    )

    yield put(
      ActivePostReducerAction.setActivePost({
        id: `${response.id}`,
        title: response.title,
        body: response.body,
      }),
    )
  } catch (error: any) {
    console.error('[Error in `loadActivePostWorker`]', error)
    yield put(ActivePostReducerAction.setError(error.message))
  } finally {
    yield put(ActivePostReducerAction.setLoadingState(ActivePostLoadingState.LOADED))
  }
}

export function* loadActivePostWatcher() {
  yield takeLatest(ActivePostActionType.LOAD_ACTIVE_POST, loadActivePostWorker)
}
