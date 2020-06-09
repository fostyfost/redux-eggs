import { XKCD_MODULE_NAME } from './index'

export enum XkcdLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface XkcdAwareState {
  [XKCD_MODULE_NAME]: XkcdState
}

export interface XkcdInfo {
  num: number
  year: string
  month: string
  day: string
  link: string
  news: string
  safe_title: string
  transcript: string
  alt: string
  img: string
  title: string
}

export interface XkcdState {
  info?: XkcdInfo
  error?: string
  loadingState: XkcdLoadingState
}

export const xkcdInitialState = {
  loadingState: XkcdLoadingState.NEVER,
}
