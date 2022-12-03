import { call, put, select, takeLatest } from 'typed-redux-saga'

import type { ActivePostResponseItem } from '@/eggs/active-post/contracts/api-response'
import { ActivePostLoadingState } from '@/eggs/active-post/contracts/state'
import { errorSelector } from '@/eggs/active-post/selectors'
import { ActivePostPublicAction, ActivePostReducerAction } from '@/eggs/active-post/slice'
import { fetchAsJson } from '@/utils/fetch-as-json'

function* loadActivePostWorker({ payload }: ReturnType<typeof ActivePostPublicAction.loadActivePost>) {
  yield* put(ActivePostReducerAction.setLoadingState(ActivePostLoadingState.LOADING))

  const error = yield* select(errorSelector)

  if (error) {
    yield* put(ActivePostReducerAction.setError(undefined))
  }

  try {
    const responseItems = yield* call(() => {
      return fetchAsJson<ActivePostResponseItem[]>('https://jsonplaceholder.typicode.com/posts')
    })

    const post = responseItems.slice(0, 10).find(post => `${post.id}` === payload)

    if (post) {
      yield* put(
        ActivePostReducerAction.setActivePost({
          id: `${post.id}`,
          title: post.title,
          body: post.body,
        }),
      )
    } else {
      yield* put(ActivePostReducerAction.setError(`Post #${payload} not found`))
    }
  } catch (error: any) {
    console.error('[Error in `loadActivePostWorker`]', error)
    yield* put(ActivePostReducerAction.setError(error.message))
  } finally {
    yield* put(ActivePostReducerAction.setLoadingState(ActivePostLoadingState.LOADED))
  }
}

export function* loadActivePostWatcher() {
  yield* takeLatest(ActivePostPublicAction.loadActivePost, loadActivePostWorker)
}
