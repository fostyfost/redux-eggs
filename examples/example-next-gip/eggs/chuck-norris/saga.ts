import { call, delay, put, select, takeLatest } from 'redux-saga/effects'

import { ChuckNorrisReducerAction } from '@/eggs/chuck-norris/action-creators'
import { ChuckNorrisActionType } from '@/eggs/chuck-norris/action-types'
import type { JokeResponse } from '@/eggs/chuck-norris/contracts/api-response'
import { ChuckNorrisLoadingState } from '@/eggs/chuck-norris/contracts/state'
import { errorSelector } from '@/eggs/chuck-norris/selectors'
import { fetchAsJson } from '@/utils/fetch-as-json'

function* loadChuckNorrisJokeWorker() {
  yield put(ChuckNorrisReducerAction.setLoadingState(ChuckNorrisLoadingState.LOADING))

  const error: ReturnType<typeof errorSelector> = yield select(errorSelector)

  if (error) {
    yield put(ChuckNorrisReducerAction.setError(undefined))
  }

  yield delay(1000)

  try {
    const joke: JokeResponse = yield call(() => {
      return fetchAsJson<JokeResponse>('https://api.chucknorris.io/jokes/random')
    })

    yield put(ChuckNorrisReducerAction.setJoke(joke.value))
  } catch (error: any) {
    console.error('[Error in `loadChuckNorrisJokeWorker`]', error)
    yield put(ChuckNorrisReducerAction.setError(error.message))
  } finally {
    yield put(ChuckNorrisReducerAction.setLoadingState(ChuckNorrisLoadingState.LOADED))
  }
}

export function* loadChuckNorrisJokeWatcher() {
  yield takeLatest(ChuckNorrisActionType.LOAD_JOKE, loadChuckNorrisJokeWorker)
}
