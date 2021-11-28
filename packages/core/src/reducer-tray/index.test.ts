import type { Reducer, ReducersMapObject } from 'redux'
import { combineReducers, createStore } from 'redux'

import type { ReducerEntry } from '@/reducer-tray'
import { getReducerTray } from '@/reducer-tray'
import { REDUCE_ACTION_TYPE } from '@/store'

describe('Tests for reducer tray', () => {
  const getReducer = (): Reducer => {
    return (state = { test: true }) => {
      return state
    }
  }

  const entry1: ReducerEntry = ['reducer1', getReducer()]
  const entry2: ReducerEntry = ['reducer2', getReducer()]
  const entry3: ReducerEntry = ['reducer3', getReducer()]
  const entry4: ReducerEntry = ['reducer4', getReducer()]

  const spyOnConsoleWarn = jest.spyOn(console, 'warn')
  const spyOnConsoleError = jest.spyOn(console, 'error')

  afterEach(() => {
    expect(spyOnConsoleWarn).not.toBeCalled()
    expect(spyOnConsoleError).not.toBeCalled()
  })

  afterAll(() => {
    spyOnConsoleWarn.mockRestore()
    spyOnConsoleError.mockRestore()
  })

  test('Reducers should be added to and removed from tray correctly', () => {
    const tray = getReducerTray(combineReducers)

    const store = createStore(tray.reducer)

    tray.add([entry1])
    tray.add([entry2])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    expect(Object.keys(store.getState())).toEqual(['reducer1', 'reducer2'])

    tray.remove([entry2])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    expect(Object.keys(store.getState())).toEqual(['reducer1'])

    tray.remove([entry2])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    expect(Object.keys(store.getState())).toEqual(['reducer1'])

    tray.remove([entry2])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    expect(Object.keys(store.getState())).toEqual(['reducer1'])

    tray.add([entry3])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    expect(Object.keys(store.getState())).toEqual(['reducer1', 'reducer3'])

    // Reducer count: `0`
    tray.remove([entry1])
    tray.remove([entry3])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    expect(Object.keys(store.getState())).toEqual([])

    // Reducer count: `0`
    tray.remove([entry4])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    expect(Object.keys(store.getState())).toEqual([])

    // Reducer count: `1`
    tray.add([entry4])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    expect(Object.keys(store.getState())).toEqual(['reducer4'])

    // Reducer count: `2`
    tray.add([entry4])
    // Reducer count: `3`
    tray.add([entry4])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    expect(Object.keys(store.getState())).toEqual(['reducer4'])

    // Reducer count: `2`
    tray.remove([entry4])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    expect(Object.keys(store.getState())).toEqual(['reducer4'])

    // Reducer count: `1`
    tray.remove([entry4])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    expect(Object.keys(store.getState())).toEqual(['reducer4'])

    // Reducer count: `0`
    tray.remove([entry4])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    expect(Object.keys(store.getState())).toEqual([])
  })

  test('Reducer tray works correctly with custom reducer combiner', () => {
    let combinedKeys: string[] = []

    const combiner = jest.fn()
    combiner.mockImplementation((reducersMap: ReducersMapObject): ReturnType<typeof combineReducers> => {
      combinedKeys = Object.keys(reducersMap)
      return combineReducers(reducersMap)
    })

    const tray = getReducerTray(combiner)

    const store = createStore(tray.reducer)

    expect(combiner).not.toBeCalled()
    expect(combinedKeys).toEqual([])
    expect(Object.keys(store.getState())).toEqual(combinedKeys)

    tray.add([entry1])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    tray.add([entry2])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    expect(combiner).toBeCalledTimes(2)
    expect(combinedKeys).toEqual(['reducer1', 'reducer2'])
    expect(Object.keys(store.getState())).toEqual(combinedKeys)
    combiner.mockClear()

    tray.remove([entry2])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    expect(combiner).toBeCalledTimes(1)
    expect(combinedKeys).toEqual(['reducer1'])
    expect(Object.keys(store.getState())).toEqual(combinedKeys)
    combiner.mockClear()

    tray.remove([entry2])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    expect(combiner).not.toBeCalled()
    expect(combinedKeys).toEqual(['reducer1'])
    expect(Object.keys(store.getState())).toEqual(combinedKeys)
    combiner.mockClear()

    tray.remove([entry3])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    expect(combiner).not.toBeCalled()
    expect(combinedKeys).toEqual(['reducer1'])
    expect(Object.keys(store.getState())).toEqual(combinedKeys)
    combiner.mockClear()

    tray.add([entry3])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    expect(combiner).toBeCalledTimes(1)
    expect(combinedKeys).toEqual(['reducer1', 'reducer3'])
    expect(Object.keys(store.getState())).toEqual(combinedKeys)
    combiner.mockClear()

    tray.remove([entry1])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    tray.remove([entry3])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    expect(combiner).toBeCalledTimes(2)
    expect(combinedKeys).toEqual([])
    expect(Object.keys(store.getState())).toEqual(combinedKeys)
    combiner.mockClear()

    tray.add([entry1])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    tray.add([entry1])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    tray.add([entry2])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    tray.add([entry2])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    expect(combiner).toBeCalledTimes(2)
    expect(combinedKeys).toEqual(['reducer1', 'reducer2'])
    expect(Object.keys(store.getState())).toEqual(combinedKeys)
    combiner.mockClear()

    tray.remove([entry1])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    tray.remove([entry2])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    expect(combiner).not.toBeCalled()
    expect(combinedKeys).toEqual(['reducer1', 'reducer2'])
    expect(Object.keys(store.getState())).toEqual(combinedKeys)
    combiner.mockClear()

    tray.remove([entry1])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    tray.remove([entry2])
    store.dispatch({ type: REDUCE_ACTION_TYPE })
    expect(combiner).toBeCalledTimes(2)
    expect(combinedKeys).toEqual([])
    expect(Object.keys(store.getState())).toEqual(combinedKeys)
    combiner.mockClear()
  })
})
