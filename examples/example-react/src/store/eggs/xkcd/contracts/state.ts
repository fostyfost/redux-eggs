import type { XKCD_REDUCER_KEY } from '../reducer'
import type { XkcdInfo } from './api-response'

export enum XkcdLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface XkcdAwareState {
  [XKCD_REDUCER_KEY]: XkcdState
}

export interface XkcdState {
  info?: XkcdInfo
  loadingState: XkcdLoadingState
}
