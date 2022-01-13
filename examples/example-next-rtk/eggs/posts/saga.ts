import { call, put, select, takeLatest } from 'typed-redux-saga'

import type { PostsResponseItem } from '@/eggs/posts/contracts/api-response'
import { PostsLoadingState } from '@/eggs/posts/contracts/state'
import { errorSelector } from '@/eggs/posts/selectors'
import { PostsPublicAction, PostsReducerAction } from '@/eggs/posts/slice'
import { fetchAsJson } from '@/utils/fetch-as-json'

function* loadPostsWorker() {
  yield* put(PostsReducerAction.setLoadingState(PostsLoadingState.LOADING))

  const error = yield* select(errorSelector)

  if (error) {
    yield* put(PostsReducerAction.setError(undefined))
  }

  try {
    const responseItems = yield* call<(...args: Parameters<typeof fetchAsJson>) => Promise<PostsResponseItem[]>>(
      fetchAsJson,
      'https://jsonplaceholder.typicode.com/posts',
    )

    yield* put(
      PostsReducerAction.setPosts(
        responseItems.slice(0, 10).map(responseItem => ({
          id: `${responseItem.id}`,
          title: responseItem.title,
        })),
      ),
    )
  } catch (error: any) {
    console.error('[Error in `loadPostsWorker`]', error)
    yield* put(PostsReducerAction.setError(error.message))
  } finally {
    yield* put(PostsReducerAction.setLoadingState(PostsLoadingState.LOADED))
  }
}

export function* loadPostsWatcher() {
  yield* takeLatest(PostsPublicAction.loadPosts, loadPostsWorker)
}
