import { call, put, select, takeLatest } from 'redux-saga/effects'

import { XkcdReducerAction } from '@/eggs/xkcd/action-creators'
import { XkcdActionType } from '@/eggs/xkcd/action-types'
import type { XkcdInfo } from '@/eggs/xkcd/contracts/api-response'
import { XkcdLoadingState } from '@/eggs/xkcd/contracts/state'
import { errorSelector, xkcdInfoSelector } from '@/eggs/xkcd/selectors'
import { getRandomInteger } from '@/eggs/xkcd/utils/random-integer'
import { fetchAsJson } from '@/utils/fetch-as-json'

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
    const info: XkcdInfo = yield call(() => {
      return fetchAsJson<XkcdInfo>(`https://xkcd.now.sh/?comic=${getRandomInteger(0, 1000)}`)
    })

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
