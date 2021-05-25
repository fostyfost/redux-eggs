import type { Action as ReduxAction } from 'redux'

interface ActionWithPayload<T extends string, P> extends ReduxAction<T> {
  payload: P
  meta?: Record<string, string>
}

export function createAction<T extends string>(type: T): ReduxAction<T>

export function createAction<T extends string, P>(
  type: T,
  payload: P,
  meta?: Record<string, string>,
): ActionWithPayload<T, P>

export function createAction<T extends string, P>(type: T, payload?: P, meta?: { [key: string]: string }) {
  return { type, payload, meta }
}

type ActionsCreatorsMapObject = {
  [actionCreator: string]: (...args: any[]) => any
}

export type ActionsUnion<A extends ActionsCreatorsMapObject> = ReturnType<A[keyof A]>
