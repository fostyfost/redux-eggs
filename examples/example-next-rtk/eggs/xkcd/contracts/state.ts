import type { XkcdInfo } from '@/eggs/xkcd/contracts/api-response'
import type { XKCD_SLICE } from '@/eggs/xkcd/slice'

export enum XkcdLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface XkcdAwareState {
  [XKCD_SLICE]: XkcdState
}

export interface XkcdState {
  info?: XkcdInfo
  error?: string
  loadingState: XkcdLoadingState
}
