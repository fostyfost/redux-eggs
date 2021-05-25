import { call, delay, put, select, takeLatest } from 'redux-saga/effects'

import { fetchAsJson } from '@/utils/fetchAsJson'

import { ChuckNorrisReducerAction } from './action-creators'
import { ChuckNorrisActionType } from './action-types'
import type { JokeResponse } from './contracts/api-response'
import { ChuckNorrisLoadingState } from './contracts/state'
import { errorSelector } from './selectors'

function* loadChuckNorrisJokeWorker() {
  yield put(ChuckNorrisReducerAction.setLoadingState(ChuckNorrisLoadingState.LOADING))

  const error: ReturnType<typeof errorSelector> = yield select(errorSelector)

  if (error) {
    yield put(ChuckNorrisReducerAction.setError(undefined))
  }

  yield delay(1000)

  try {
    const joke: JokeResponse = yield call(fetchAsJson, 'https://api.chucknorris.io/jokes/random')

    yield put(ChuckNorrisReducerAction.setJoke(joke.value))
  } catch (error) {
    console.error('[Error in `loadChuckNorrisJokeWorker`]', error)
    yield put(ChuckNorrisReducerAction.setError(error.message))
  } finally {
    yield put(ChuckNorrisReducerAction.setLoadingState(ChuckNorrisLoadingState.LOADED))
  }
}

export function* loadChuckNorrisJokeWatcher() {
  yield takeLatest(ChuckNorrisActionType.LOAD_JOKE, loadChuckNorrisJokeWorker)
}
