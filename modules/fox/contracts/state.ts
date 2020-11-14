import { Immutable } from 'immer'

import { FOX_MODULE_NAME } from '../index'

export enum FoxLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface FoxAwareState {
  [FOX_MODULE_NAME]: FoxState
}

export type FoxState = Immutable<{
  fox?: string
  error?: string
  loadingState: FoxLoadingState
}>
