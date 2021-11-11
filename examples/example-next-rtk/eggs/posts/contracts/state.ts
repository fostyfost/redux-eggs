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

export interface PostsState {
  posts: PostsItem[]
  error?: string
  loadingState: PostsLoadingState
}
