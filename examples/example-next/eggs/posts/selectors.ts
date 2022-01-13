import { createSelector } from 'reselect'

import type { PostsAwareState, PostsItem } from '@/eggs/posts/contracts/state'
import { PostsLoadingState } from '@/eggs/posts/contracts/state'
import { POSTS_REDUCER_KEY } from '@/eggs/posts/reducer'

export const postsSelector = (state: PostsAwareState): PostsItem[] => {
  return state[POSTS_REDUCER_KEY].posts
}

export const errorSelector = (state: PostsAwareState): string | undefined => {
  return state[POSTS_REDUCER_KEY].error
}

export const loadingStateSelector = (state: PostsAwareState): PostsLoadingState => {
  return state[POSTS_REDUCER_KEY].loadingState
}

export const isPostsLoading = createSelector(
  loadingStateSelector,
  (loadingState: PostsLoadingState): boolean => loadingState === PostsLoadingState.LOADING,
)

export const isPostsLoaded = createSelector(
  loadingStateSelector,
  (loadingState: PostsLoadingState): boolean => loadingState === PostsLoadingState.LOADED,
)
