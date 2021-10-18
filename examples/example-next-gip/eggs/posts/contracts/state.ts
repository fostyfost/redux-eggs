import type { Immutable } from 'immer'

import type { POSTS_REDUCER_KEY } from '@/eggs/posts/reducer'

export enum PostsLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface PostsAwareState {
  [POSTS_REDUCER_KEY]: PostsState
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
