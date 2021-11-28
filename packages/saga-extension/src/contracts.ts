import type { Saga, Task } from 'redux-saga'

export interface SagaExt {
  getSagaTasks: () => Task[]
}

declare module '@redux-eggs/core' {
  interface Egg {
    sagas?: Saga[]
  }

  interface EggExt {
    getSagaTasks: () => Task[]
  }
}
