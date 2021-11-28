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

export interface PostsState {
  posts: PostsItem[]
  error?: string
  loadingState: PostsLoadingState
}
