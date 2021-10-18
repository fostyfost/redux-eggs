import type { Immutable } from 'immer'

import type { Picture } from '@/eggs/picsum/contracts/picture'
import type { PICSUM_REDUCER_KEY } from '@/eggs/picsum/reducer'

export enum PicsumLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface PicsumAwareState {
  [PICSUM_REDUCER_KEY]: PicsumState
}

export type PicsumState = Immutable<{
  pics?: Picture[]
  error?: string
  loadingState: PicsumLoadingState
}>
