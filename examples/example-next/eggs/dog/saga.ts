import { call, put, select, takeLatest } from 'redux-saga/effects'

import { fetchAsJson } from '@/utils/fetchAsJson'

import { DogReducerAction } from './action-creators'
import { DogActionType } from './action-types'
import type { DogResponse } from './contracts/api-response'
import { DogLoadingState } from './contracts/state'
import { errorSelector } from './selectors'

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
  } catch (error) {
    console.error('[Error in `loadDogWorker`]', error)
    yield put(DogReducerAction.setError(error.message))
  } finally {
    yield put(DogReducerAction.setLoadingState(DogLoadingState.LOADED))
  }
}

export function* loadDogWatcher() {
  yield takeLatest(DogActionType.LOAD_DOG, loadDogWorker)
}
