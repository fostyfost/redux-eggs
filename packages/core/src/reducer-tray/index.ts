import type {
  AnyFn,
  AnyReducer,
  AnyReducersMapObject,
  CombineAnyReducers,
  ReducerEntry,
  ReducerTray,
} from '@/contracts'
import { getCounter } from '@/counter'
import { isNonEmptyArray } from '@/utils'

export const getReducerTray = <T extends AnyFn = CombineAnyReducers>(reducerCombiner: T): ReducerTray => {
  const counter = getCounter<string>()
  const reducersMap: AnyReducersMapObject = {}
  let combinedReducer: AnyReducer
  let keysToRemove: string[] = []

  return {
    dynamicReducer(state: any = {}, action: any): AnyReducer {
      let nextState = state

      if (isNonEmptyArray(keysToRemove)) {
        nextState = { ...state }
        keysToRemove.forEach(key => delete nextState[key])
        keysToRemove = []
      }

      return (isNonEmptyArray(Object.keys(reducersMap)) ? combinedReducer : () => ({}))(nextState, action)
    },

    add(entries: ReadonlyArray<ReducerEntry>): string[] {
      const addedKeys: string[] = []

      entries.forEach(([key, reducer]) => {
        if (!counter.getCount(key)) {
          reducersMap[key] = reducer
          addedKeys.push(key)
        }

        counter.add(key)
      })

      if (isNonEmptyArray(addedKeys)) {
        combinedReducer = reducerCombiner(reducersMap)
      }

      return addedKeys
    },

    remove(entries: ReadonlyArray<ReducerEntry>): string[] {
      entries.forEach(([key]) => {
        if (counter.getCount(key) === 1) {
          delete reducersMap[key]
          keysToRemove.push(key)
        }

        counter.remove(key)
      })

      if (isNonEmptyArray(keysToRemove)) {
        combinedReducer = reducerCombiner(reducersMap)
      }

      return [...keysToRemove]
    },
  }
}
