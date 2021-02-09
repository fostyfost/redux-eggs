import type { Immutable } from 'immer'

import type { XKCD_MODULE_NAME } from '../index'
import type { XkcdInfo } from './api-response'

export enum XkcdLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface XkcdAwareState {
  [XKCD_MODULE_NAME]: XkcdState
}

export type XkcdState = Immutable<{
  info?: XkcdInfo
  error?: string
  loadingState: XkcdLoadingState
}>
