import { Immutable } from 'immer'

import { XKCD_MODULE_NAME } from '../index'
import { XkcdInfo } from './api-response'

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
