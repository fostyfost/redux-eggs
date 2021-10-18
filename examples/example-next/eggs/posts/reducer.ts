import type { Draft } from 'immer'
import produce from 'immer'

import type { PostsActionsUnion } from '@/eggs/posts/action-creators'
import { PostsActionType } from '@/eggs/posts/action-types'
import type { PostsState } from '@/eggs/posts/contracts/state'
import { PostsLoadingState } from '@/eggs/posts/contracts/state'

export const POSTS_REDUCER_KEY = 'posts' as const

const initialState: PostsState = {
  posts: [],
  loadingState: PostsLoadingState.NEVER,
}

export const postsReducer = produce((draft: Draft<PostsState>, action: PostsActionsUnion): void => {
  switch (action.type) {
    case PostsActionType.SET_ERROR:
      draft.error = action.payload
      break

    case PostsActionType.SET_POSTS:
      draft.posts = action.payload
      break

    case PostsActionType.SET_LOADING_STATE:
      draft.loadingState = action.payload
      break
  }
}, initialState)
