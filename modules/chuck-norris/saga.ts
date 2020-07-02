import { delay, put, takeLatest } from 'redux-saga/effects'

import { ChuckNorrisReducerAction } from './action-creators'
import { ChuckNorrisActionType } from './action-types'
import { ChuckNorrisLoadingState } from './state'

function* loadChuckNorrisJokeWorker() {
  yield put(ChuckNorrisReducerAction.setLoadingState(ChuckNorrisLoadingState.LOADING))

  yield delay(1000)

  try {
    const res = yield fetch('https://api.chucknorris.io/jokes/random')

    const joke = yield res.json()

    yield put(ChuckNorrisReducerAction.setJoke(joke.value))
  } catch (err) {
    yield put(ChuckNorrisReducerAction.setError(err.message))
  } finally {
    yield put(ChuckNorrisReducerAction.setLoadingState(ChuckNorrisLoadingState.LOADED))
  }
}

export function* loadChuckNorrisJokeWatcher() {
  yield takeLatest(ChuckNorrisActionType.LOAD_JOKE, loadChuckNorrisJokeWorker)
}
