import { call, put, select, takeLatest } from 'redux-saga/effects'

import type { ActivePostPublicAction } from '@/eggs/active-post/action-creators'
import { ActivePostReducerAction } from '@/eggs/active-post/action-creators'
import { ActivePostActionType } from '@/eggs/active-post/action-types'
import type { ActivePostResponseItem } from '@/eggs/active-post/contracts/api-response'
import { ActivePostLoadingState } from '@/eggs/active-post/contracts/state'
import { errorSelector } from '@/eggs/active-post/selectors'
import { fetchAsJson } from '@/utils/fetch-as-json'
import { getServerHost } from '@/utils/get-server-host'

function* loadActivePostWorker({ payload }: ReturnType<typeof ActivePostPublicAction.loadActivePost>) {
  yield put(ActivePostReducerAction.setLoadingState(ActivePostLoadingState.LOADING))

  const error: ReturnType<typeof errorSelector> = yield select(errorSelector)

  if (error) {
    yield put(ActivePostReducerAction.setError(undefined))
  }

  try {
    const response: ActivePostResponseItem = yield call(
      fetchAsJson,
      typeof window === 'undefined' ? `${getServerHost()}/api/posts/${payload}` : `/api/posts/${payload}`,
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
