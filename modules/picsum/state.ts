import { PICSUM_MODULE_NAME } from './index'

export enum PicsumLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface PicsumAwareState {
  [PICSUM_MODULE_NAME]: PicsumState
}

export interface PicsumState {
  pics?: any[]
  error?: string
  loadingState: PicsumLoadingState
}

export const picsumInitialState = {
  loadingState: PicsumLoadingState.NEVER,
}
