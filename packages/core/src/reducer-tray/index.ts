import type { AnyAction, combineReducers, Reducer, ReducersMapObject } from 'redux'

import { getCounter } from '@/counter'

export type ReducerEntry = [string, Reducer]

export type GetReducersStore = (reducerCombiner: typeof combineReducers) => {
  reducer: Reducer
  add(entries: ReducerEntry[]): string[]
  remove(entries: ReducerEntry[]): string[]
}

export const getReducerTray: GetReducersStore = reducerCombiner => {
  const counter = getCounter<string>()
  const map: ReducersMapObject = {}
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

      return (Object.keys(map).length ? combinedReducer : () => ({}))(nextState, action)
    },

    add(entries: ReducerEntry[]): string[] {
      const addedKeys: string[] = []

      entries.forEach(([key, reducer]) => {
        if (!counter.getCount(key)) {
          map[key] = reducer
          addedKeys.push(key)
        }

        counter.add(key)
      })

      if (addedKeys.length) {
        combinedReducer = reducerCombiner(map)
      }

      return addedKeys
    },

    remove(entries: ReducerEntry[]): string[] {
      entries.forEach(([key]) => {
        if (counter.getCount(key) === 1) {
          delete map[key]
          keysToRemove.push(key)
        }

        counter.remove(key)
      })

      if (keysToRemove.length) {
        combinedReducer = reducerCombiner(map)
      }

      return [...keysToRemove]
    },
  }
}
