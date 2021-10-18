import { call, put, select, takeLatest } from 'redux-saga/effects'

import { PostsReducerAction } from '@/eggs/posts/action-creators'
import { PostsActionType } from '@/eggs/posts/action-types'
import type { PostsResponseItem } from '@/eggs/posts/contracts/api-response'
import { PostsLoadingState } from '@/eggs/posts/contracts/state'
import { errorSelector } from '@/eggs/posts/selectors'
import { fetchAsJson } from '@/utils/fetch-as-json'

function* loadPostsWorker() {
  yield put(PostsReducerAction.setLoadingState(PostsLoadingState.LOADING))

  const error: ReturnType<typeof errorSelector> = yield select(errorSelector)

  if (error) {
    yield put(PostsReducerAction.setError(undefined))
  }

  try {
    const responseItems: PostsResponseItem[] = yield call(fetchAsJson, 'https://jsonplaceholder.typicode.com/posts')

    yield put(
      PostsReducerAction.setPosts(
        responseItems.slice(0, 10).map(responseItem => ({
          id: `${responseItem.id}`,
          title: responseItem.title,
        })),
      ),
    )
  } catch (error: any) {
    console.error('[Error in `loadPostsWorker`]', error)
    yield put(PostsReducerAction.setError(error.message))
  } finally {
    yield put(PostsReducerAction.setLoadingState(PostsLoadingState.LOADED))
  }
}

export function* loadPostsWatcher() {
  yield takeLatest(PostsActionType.LOAD_POSTS, loadPostsWorker)
}
