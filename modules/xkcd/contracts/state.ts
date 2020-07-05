import { XKCD_MODULE_NAME } from '../index'
import { XkcdInfo } from './api-response'
import { Immutable } from 'immer'

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
