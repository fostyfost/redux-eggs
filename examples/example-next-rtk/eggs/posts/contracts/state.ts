import type { Immutable } from 'immer'

import type { POSTS_SLICE } from '@/eggs/posts/slice'

export enum PostsLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface PostsAwareState {
  [POSTS_SLICE]: PostsState
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
