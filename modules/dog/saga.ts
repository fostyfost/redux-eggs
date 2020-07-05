import { call, delay, put, takeLatest } from 'redux-saga/effects'

import { DogReducerAction } from './action-creators'
import { DogActionType } from './action-types'
import { DogLoadingState } from './contracts/state'
import { fetchAsJson } from '../../utils/fetchAsJson'

function* loadDogWorker() {
  yield put(DogReducerAction.setLoadingState(DogLoadingState.LOADING))

  yield delay(1000)

  try {
    const res: { message: string; status: string } = yield call(fetchAsJson, 'https://dog.ceo/api/breeds/image/random')

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
