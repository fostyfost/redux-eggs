import type { Saga, Task } from 'redux-saga'

declare module '@redux-eggs/core' {
  interface Egg {
    readonly sagas?: Saga[]
  }
}

export type SagaExt = {
  getSagaTasks: () => Task[]
}
