import type { Immutable } from 'immer'

import type { ACTIVE_POST_REDUCER_KEY } from '@/eggs/active-post/reducer'

export enum ActivePostLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface ActivePostAwareState {
  [ACTIVE_POST_REDUCER_KEY]: ActivePostState
}

export interface ActivePost {
  id: string
  title: string
  body: string
}

export type ActivePostState = Immutable<{
  activePost?: ActivePost
  error?: string
  loadingState: ActivePostLoadingState
}>
