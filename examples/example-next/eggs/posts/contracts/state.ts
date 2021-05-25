import type { Immutable } from 'immer'

import type { POSTS_MODULE_NAME } from '../index'

export enum PostsLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface PostsAwareState {
  [POSTS_MODULE_NAME]: PostsState
}

export interface PostsItem {
  id: string
  title: string
}

export type PostsState = Immutable<{
  posts: PostsItem[]
  error?: string
  loadingState: PostsLoadingState
}>
