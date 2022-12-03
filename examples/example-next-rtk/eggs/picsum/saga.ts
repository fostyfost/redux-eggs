import { call, put, select, takeLatest } from 'typed-redux-saga'

import type { Picture } from '@/eggs/picsum/contracts/picture'
import { PicsumLoadingState } from '@/eggs/picsum/contracts/state'
import { errorSelector } from '@/eggs/picsum/selectors'
import { PicsumPublicAction, PicsumReducerAction } from '@/eggs/picsum/slice'
import { fetchAsJson } from '@/utils/fetch-as-json'

function* loadPicsumWorker() {
  yield* put(PicsumReducerAction.setLoadingState(PicsumLoadingState.LOADING))

  const error = yield* select(errorSelector)

  if (error) {
    yield* put(PicsumReducerAction.setError(undefined))
  }

  try {
    const pics = yield* call(() => {
      return fetchAsJson<Picture[]>('https://picsum.photos/v2/list')
    })

    yield* put(PicsumReducerAction.setPics(pics))
  } catch (error: any) {
    console.error('[Error in `loadPicsumWorker`]', error)
    yield* put(PicsumReducerAction.setError(error.message))
  } finally {
    yield* put(PicsumReducerAction.setLoadingState(PicsumLoadingState.LOADED))
  }
}

export function* loadPicsumWatcher() {
  yield* takeLatest(PicsumPublicAction.loadPics, loadPicsumWorker)
}
