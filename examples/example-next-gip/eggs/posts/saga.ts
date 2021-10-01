import { call, put, select, takeLatest } from 'redux-saga/effects'

import type { PostsResponseItem } from '@/eggs/posts/contracts/api-response'
import { fetchAsJson } from '@/utils/fetchAsJson'

import { PostsReducerAction } from './action-creators'
import { PostsActionType } from './action-types'
import { PostsLoadingState } from './contracts/state'
import { errorSelector } from './selectors'

function* loadPostsWorker() {
  yield put(PostsReducerAction.setLoadingState(PostsLoadingState.LOADING))

  const error: ReturnType<typeof errorSelector> = yield select(errorSelector)

  if (error) {
    yield put(PostsReducerAction.setError(undefined))
  }

  try {
    const responseItems: PostsResponseItem[] = yield call(
      fetchAsJson,
      typeof window === 'undefined' ? `http://localhost:${process.env.PORT}/api/posts` : '/api/posts',
    )

    yield put(
      PostsReducerAction.setPosts(
        responseItems.map(responseItem => ({
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
