import type { ACTIVE_POST_SLICE } from '@/eggs/active-post/slice'

export enum ActivePostLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface ActivePostAwareState {
  [ACTIVE_POST_SLICE]: ActivePostState
}

export interface ActivePost {
  id: string
  title: string
  body: string
}

export interface ActivePostState {
  activePost?: ActivePost
  error?: string
  loadingState: ActivePostLoadingState
}
