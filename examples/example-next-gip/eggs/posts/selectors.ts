import type { Immutable } from 'immer'
import { createSelector } from 'reselect'

import type { PostsAwareState, PostsItem } from './contracts/state'
import { PostsLoadingState } from './contracts/state'
import { POSTS_MODULE_NAME } from './index'

export const postsSelector = (state: PostsAwareState): Immutable<PostsItem[]> => {
  return state[POSTS_MODULE_NAME].posts
}

export const errorSelector = (state: PostsAwareState): string | undefined => {
  return state[POSTS_MODULE_NAME].error
}

export const loadingStateSelector = (state: PostsAwareState): PostsLoadingState => {
  return state[POSTS_MODULE_NAME].loadingState
}

export const isPostsLoading = createSelector(loadingStateSelector, (loadingState: PostsLoadingState): boolean => {
  return loadingState === PostsLoadingState.LOADING
})

export const isPostsLoaded = createSelector(loadingStateSelector, (loadingState: PostsLoadingState): boolean => {
  return loadingState === PostsLoadingState.LOADED
})
