import type { Immutable } from 'immer'

import type { Picture } from '@/eggs/picsum/contracts/picture'
import type { PICSUM_SLICE } from '@/eggs/picsum/slice'

export enum PicsumLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface PicsumAwareState {
  [PICSUM_SLICE]: PicsumState
}

export type PicsumState = Immutable<{
  pics?: Picture[]
  error?: string
  loadingState: PicsumLoadingState
}>
