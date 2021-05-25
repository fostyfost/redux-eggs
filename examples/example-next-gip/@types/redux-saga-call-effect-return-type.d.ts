import type { SagaIterator } from 'redux-saga'

declare type YieldReturnType<T> = ReturnType<T> extends Promise<infer U>
  ? U
  : ReturnType<T> extends SagaIterator<infer U>
  ? U
  : ReturnType<T>
