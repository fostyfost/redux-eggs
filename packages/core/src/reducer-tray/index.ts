import type { AnyAction, combineReducers, Reducer, ReducersMapObject } from 'redux'

import { getCounter } from '@/counter'

export type ReducerEntry = [string, Reducer]

export interface ReducersTray {
  reducer: Reducer
  add(entries: ReducerEntry[]): string[]
  remove(entries: ReducerEntry[]): string[]
}

export const getReducerTray = <T extends typeof combineReducers = typeof combineReducers>(
  reducerCombiner: T,
): ReducersTray => {
  const counter = getCounter<string>()
  const reducersMap: ReducersMapObject = {}
  let combinedReducer: Reducer
  let keysToRemove: string[] = []

  return {
    reducer(state: any = {}, action: AnyAction): Reducer {
      let nextState = state

      if (keysToRemove.length) {
        nextState = Object.assign({}, state)
        keysToRemove.forEach(key => delete nextState[key])
        keysToRemove = []
      }

      return (Object.keys(reducersMap).length ? combinedReducer : () => ({}))(nextState, action)
    },

    add(entries: ReducerEntry[]): string[] {
      const addedKeys: string[] = []

      entries.forEach(([key, reducer]) => {
        if (!counter.getCount(key)) {
          reducersMap[key] = reducer
          addedKeys.push(key)
        }

        counter.add(key)
      })

      if (addedKeys.length) {
        combinedReducer = reducerCombiner(reducersMap)
      }

      return addedKeys
    },

    remove(entries: ReducerEntry[]): string[] {
      entries.forEach(([key]) => {
        if (counter.getCount(key) === 1) {
          delete reducersMap[key]
          keysToRemove.push(key)
        }

        counter.remove(key)
      })

      if (keysToRemove.length) {
        combinedReducer = reducerCombiner(reducersMap)
      }

      return [...keysToRemove]
    },
  }
}
