import type { Immutable } from 'immer'

import type { ACTIVE_POST_MODULE_NAME } from '../index'

export enum ActivePostLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface ActivePostAwareState {
  [ACTIVE_POST_MODULE_NAME]: ActivePostState
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
