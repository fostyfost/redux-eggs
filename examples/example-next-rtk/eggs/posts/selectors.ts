import { createSelector } from '@reduxjs/toolkit'

import type { PostsAwareState, PostsItem } from '@/eggs/posts/contracts/state'
import { PostsLoadingState } from '@/eggs/posts/contracts/state'
import { POSTS_SLICE } from '@/eggs/posts/slice'

export const postsSelector = (state: PostsAwareState): PostsItem[] => {
  return state[POSTS_SLICE].posts
}

export const errorSelector = (state: PostsAwareState): string | undefined => {
  return state[POSTS_SLICE].error
}

export const loadingStateSelector = (state: PostsAwareState): PostsLoadingState => {
  return state[POSTS_SLICE].loadingState
}

export const isPostsLoading = createSelector(
  loadingStateSelector,
  (loadingState: PostsLoadingState): boolean => loadingState === PostsLoadingState.LOADING,
)

export const isPostsLoaded = createSelector(
  loadingStateSelector,
  (loadingState: PostsLoadingState): boolean => loadingState === PostsLoadingState.LOADED,
)
