import { call, put, select, takeLatest } from 'typed-redux-saga'

import type { XkcdInfo } from '@/eggs/xkcd/contracts/api-response'
import { XkcdLoadingState } from '@/eggs/xkcd/contracts/state'
import { errorSelector, xkcdInfoSelector } from '@/eggs/xkcd/selectors'
import { XkcdPublicAction, XkcdReducerAction } from '@/eggs/xkcd/slice'
import { getRandomInteger } from '@/eggs/xkcd/utils/random-integer'
import { fetchAsJson } from '@/utils/fetch-as-json'

function* loadXkcdInfoWorker() {
  yield* put(XkcdReducerAction.setLoadingState(XkcdLoadingState.LOADING))

  const currentInfo = yield* select(xkcdInfoSelector)

  if (currentInfo) {
    yield* put(XkcdReducerAction.setInfo(undefined))
  }

  const error = yield* select(errorSelector)

  if (error) {
    yield* put(XkcdReducerAction.setError(undefined))
  }

  try {
    // Alternative api https://xkcd.com/${getRandomInteger(0, 1000)}/info.0.json
    const info = yield* call(() => {
      return fetchAsJson<XkcdInfo>(`https://xkcd.now.sh/?comic=${getRandomInteger(0, 1000)}`)
    })

    yield* put(XkcdReducerAction.setInfo(info))
  } catch (error: any) {
    console.error('[Error in `loadXkcdInfoWorker`]', error)
    yield* put(XkcdReducerAction.setError(error.message))
  } finally {
    yield* put(XkcdReducerAction.setLoadingState(XkcdLoadingState.LOADED))
  }
}

export function* loadXkcdInfoWatcher() {
  yield* takeLatest(XkcdPublicAction.loadInfo, loadXkcdInfoWorker)
}
