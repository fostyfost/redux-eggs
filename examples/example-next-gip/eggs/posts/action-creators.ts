import { PostsActionType } from '@/eggs/posts/action-types'
import type { PostsLoadingState } from '@/eggs/posts/contracts/state'
import type { PostsItem } from '@/eggs/posts/contracts/state'
import type { ActionsUnion } from '@/store/action-helper'
import { createAction } from '@/store/action-helper'

export const PostsPublicAction = {
  loadPosts() {
    return createAction(PostsActionType.LOAD_POSTS)
  },
}

export const PostsReducerAction = {
  setPosts(payload: PostsItem[]) {
    return createAction(PostsActionType.SET_POSTS, payload)
  },
  setError(payload: string | undefined) {
    return createAction(PostsActionType.SET_ERROR, payload)
  },
  setLoadingState(payload: PostsLoadingState) {
    return createAction(PostsActionType.SET_LOADING_STATE, payload)
  },
}

export type PostsActionsUnion = ActionsUnion<typeof PostsReducerAction>
