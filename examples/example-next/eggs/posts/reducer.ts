import type { Draft } from 'immer'
import produce from 'immer'

import type { PostsActionsUnion } from './action-creators'
import { PostsActionType } from './action-types'
import type { PostsState } from './contracts/state'
import { PostsLoadingState } from './contracts/state'

const postsInitialState: PostsState = {
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
}, postsInitialState)
