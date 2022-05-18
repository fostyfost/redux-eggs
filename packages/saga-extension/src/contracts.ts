import type { Extension } from '@redux-eggs/core'
import type { StoreEnhancer } from 'redux'
import type { Saga, SagaMiddleware, Task } from 'redux-saga'

// TODO: Pass arguments with Saga's
export interface SagaTray {
  getTasks(): Task[]
  add(sagas: Saga[]): void
  remove(sagas: Saga[]): void
}

export type SagaExtension = Extension<SagaMiddleware, StoreEnhancer<SagaExt>>

export interface SagaExt {
  getSagaTasks: () => Task[]
}

declare module '@redux-eggs/core' {
  interface Egg {
    sagas?: Saga[]
  }
}
