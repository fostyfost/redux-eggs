import { call, delay, put, takeLatest } from 'redux-saga/effects'

import { fetchAsJson } from '../../utils/fetchAsJson'
import { DogReducerAction } from './action-creators'
import { DogActionType } from './action-types'
import { DogResponse } from './contracts/api-response'
import { DogLoadingState } from './contracts/state'

function* loadDogWorker() {
  yield put(DogReducerAction.setLoadingState(DogLoadingState.LOADING))

  yield put(DogReducerAction.setError(undefined))

  yield delay(1000)

  try {
    const res: DogResponse = yield call(fetchAsJson, 'https://dog.ceo/api/breeds/image/random')

    if (res.status === 'success') {
      yield put(DogReducerAction.setDog(res.message))
    } else {
      yield put(DogReducerAction.setError(res.message))
    }
  } catch (err) {
    yield put(DogReducerAction.setError(err.message))
  } finally {
    yield put(DogReducerAction.setLoadingState(DogLoadingState.LOADED))
  }
}

export function* loadDogWatcher() {
  yield takeLatest(DogActionType.LOAD_DOG, loadDogWorker)
}
