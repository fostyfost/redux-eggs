import { call, put, select, takeLatest } from 'redux-saga/effects'

import { DogReducerAction } from '@/eggs/dog/action-creators'
import { DogActionType } from '@/eggs/dog/action-types'
import type { DogResponse } from '@/eggs/dog/contracts/api-response'
import { DogLoadingState } from '@/eggs/dog/contracts/state'
import { errorSelector } from '@/eggs/dog/selectors'
import { fetchAsJson } from '@/utils/fetch-as-json'

function* loadDogWorker() {
  yield put(DogReducerAction.setLoadingState(DogLoadingState.LOADING))

  const error: ReturnType<typeof errorSelector> = yield select(errorSelector)

  if (error) {
    yield put(DogReducerAction.setError(undefined))
  }

  try {
    const res: DogResponse = yield call(fetchAsJson, 'https://dog.ceo/api/breeds/image/random')

    if (res.status === 'success') {
      yield put(DogReducerAction.setDog(res.message))
    } else {
      yield put(DogReducerAction.setError(res.message))
    }
  } catch (error: any) {
    console.error('[Error in `loadDogWorker`]', error)
    yield put(DogReducerAction.setError(error.message))
  } finally {
    yield put(DogReducerAction.setLoadingState(DogLoadingState.LOADED))
  }
}

export function* loadDogWatcher() {
  yield takeLatest(DogActionType.LOAD_DOG, loadDogWorker)
}
