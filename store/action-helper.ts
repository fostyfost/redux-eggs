import type { Action as ReduxAction } from 'redux'

export interface Action<T> extends ReduxAction<T> {
  /**
   * The meta property for the action (see Flux Standard Actions)
   */
  meta?: { [key: string]: any }
}

/**
 * A better typing for the Redux Action
 */
export interface ActionWithPayload<T extends string, P> extends Action<T> {
  /**
   * The payload of this action
   */
  payload: P
}

/**
 * Create a new action with type and payload
 */
export function createAction<T extends string>(type: T): Action<T>
export function createAction<T extends string, P>(
  type: T,
  payload: P,
  meta?: { [key: string]: string },
): ActionWithPayload<T, P>
export function createAction<T extends string, P>(type: T, payload?: P, meta?: { [key: string]: string }) {
  return { type, payload, meta }
}

/**
 * @copyright Copyright (c) 2018 Martin Hochel
 * Borrowed from the rex-utils library
 */

type ActionsCreatorsMapObject = {
  [actionCreator: string]: (...args: any[]) => any
}
export type ActionsUnion<A extends ActionsCreatorsMapObject> = ReturnType<A[keyof A]>
export type ActionsOfType<ActionsUnion, ActionType extends string> = ActionsUnion extends Action<ActionType>
  ? ActionsUnion
  : never

export type StringMap<T> = { [key: string]: T }
