import { call, delay, put, select, takeLatest } from 'typed-redux-saga'

import type { JokeResponse } from '@/eggs/chuck-norris/contracts/api-response'
import { ChuckNorrisLoadingState } from '@/eggs/chuck-norris/contracts/state'
import { errorSelector } from '@/eggs/chuck-norris/selectors'
import { ChuckNorrisPublicAction, ChuckNorrisReducerAction } from '@/eggs/chuck-norris/slice'
import { fetchAsJson } from '@/utils/fetch-as-json'

function* loadChuckNorrisJokeWorker() {
  yield* put(ChuckNorrisReducerAction.setLoadingState(ChuckNorrisLoadingState.LOADING))

  const error = yield* select(errorSelector)

  if (error) {
    yield* put(ChuckNorrisReducerAction.setError(undefined))
  }

  yield* delay(1000)

  try {
    const joke = yield* call<(...args: Parameters<typeof fetchAsJson>) => Promise<JokeResponse>>(
      fetchAsJson,
      'https://api.chucknorris.io/jokes/random',
    )

    yield* put(ChuckNorrisReducerAction.setJoke(joke.value))
  } catch (error: any) {
    console.error('[Error in `loadChuckNorrisJokeWorker`]', error)
    yield* put(ChuckNorrisReducerAction.setError(error.message))
  } finally {
    yield* put(ChuckNorrisReducerAction.setLoadingState(ChuckNorrisLoadingState.LOADED))
  }
}

export function* loadChuckNorrisJokeWatcher() {
  yield* takeLatest(ChuckNorrisPublicAction.loadJoke, loadChuckNorrisJokeWorker)
}
