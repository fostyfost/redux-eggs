import { Immutable } from 'immer'

import { PICSUM_MODULE_NAME } from '../index'
import { Picture } from './picture'

export enum PicsumLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface PicsumAwareState {
  [PICSUM_MODULE_NAME]: PicsumState
}

export type PicsumState = Immutable<{
  pics?: Picture[]
  error?: string
  loadingState: PicsumLoadingState
}>
