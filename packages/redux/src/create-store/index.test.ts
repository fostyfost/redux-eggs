import type { Egg, Extension, RemoveAddedEggs } from '@redux-eggs/core'
import type { Action, AnyAction, Middleware, ReducersMapObject, StoreEnhancer } from 'redux'
import { combineReducers, compose } from 'redux'
import type { ThunkAction, ThunkMiddleware } from 'redux-thunk'
import thunk from 'redux-thunk'

import type { ExtensionEventHandler } from '@/contracts'
import { createStore } from '@/create-store'

describe('Tests for `createStore` with Redux', () => {
  const increment = () => ({ type: 'increment' })

  const incrementAsync = (): ThunkAction<
    Promise<{ counterBefore: number; counterAfter: number }>,
    any,
    undefined,
    AnyAction
  > => {
    return (dispatch, getState) => {
      const { counter: counterBefore } = getState()
      dispatch(increment())
      const { counter: counterAfter } = getState()
      return Promise.resolve({ counterBefore, counterAfter })
    }
  }

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

  test('Eggs with reducers are added and removed correctly', () => {
    const reducersMap1: ReducersMapObject = { egg1: () => ({}) }
    const reducersMap2: ReducersMapObject = { egg2: () => ({}) }

    const egg1: Egg = { id: 'egg1', reducersMap: { ...reducersMap1 } }
    const egg2: Egg = { id: 'egg2', reducersMap: { ...reducersMap2 } }
    const egg3: Egg = { id: 'egg3', reducersMap: { ...reducersMap1, ...reducersMap2 } }

    const store = createStore()

    const removers: RemoveAddedEggs[] = []

    removers.push(store.addEggs([]))
    expect(store.getState()).toEqual({})

    removers.pop()?.()
    expect(store.getState()).toEqual({})

    removers.push(store.addEggs(egg1, egg2))
    expect(store.getState()).toEqual({ egg1: {}, egg2: {} })

    removers.push(store.addEggs(egg1, egg2))
    expect(store.getState()).toEqual({ egg1: {}, egg2: {} })

    removers.push(store.addEggs(egg3))
    expect(store.getState()).toEqual({ egg1: {}, egg2: {} })

    removers.pop()?.()
    expect(store.getState()).toEqual({ egg1: {}, egg2: {} })

    removers.pop()?.()
    expect(store.getState()).toEqual({ egg1: {}, egg2: {} })

    removers.pop()?.()
    expect(store.getState()).toEqual({})
    expect(store.getEggs()).toEqual([])

    expect(removers.length).toBe(0)
  })

  test('Store is initialized with custom `reducerCombiner`', () => {
    const reducerCombiner = jest.fn((reducers: ReducersMapObject) => {
      return combineReducers(reducers)
    })

    const reducersMap1: ReducersMapObject = { egg1: () => ({}) }
    const reducersMap2: ReducersMapObject = { egg2: () => ({}) }
    const reducersMap3: ReducersMapObject = { egg3: () => ({}) }

    const egg1: Egg = { id: 'egg1', reducersMap: { ...reducersMap1 } }
    const egg2: Egg = { id: 'egg2', reducersMap: { ...reducersMap2 } }
    const egg3: Egg = { id: 'egg3', reducersMap: { ...reducersMap1, ...reducersMap2 } }
    const egg4: Egg = { id: 'egg4', reducersMap: { ...reducersMap3 } }

    const store = createStore({ reducerCombiner })

    const removers: RemoveAddedEggs[] = []

    removers.push(store.addEggs([]))
    removers.pop()?.()
    expect(reducerCombiner).not.toBeCalled()

    removers.push(store.addEggs(egg1, egg2))
    expect(reducerCombiner).toBeCalledTimes(1)
    expect(reducerCombiner).nthCalledWith(1, { ...reducersMap1, ...reducersMap2 })

    removers.push(store.addEggs(egg1, egg2))
    expect(reducerCombiner).toBeCalledTimes(1)

    removers.push(store.addEggs(egg3))
    expect(reducerCombiner).toBeCalledTimes(1)

    removers.push(store.addEggs(egg4))
    expect(reducerCombiner).toBeCalledTimes(2)
    expect(reducerCombiner).nthCalledWith(2, { ...reducersMap1, ...reducersMap2, ...reducersMap3 })

    removers.pop()?.()
    expect(reducerCombiner).toBeCalledTimes(3)
    expect(reducerCombiner).nthCalledWith(3, { ...reducersMap1, ...reducersMap2 })

    removers.pop()?.()
    removers.pop()?.()
    expect(reducerCombiner).toBeCalledTimes(3)

    removers.pop()?.()
    expect(reducerCombiner).toBeCalledTimes(4)
    expect(reducerCombiner).nthCalledWith(4, {})

    expect(removers.length).toBe(0)
  })

  test('Middlewares from eggs should work', () => {
    let queue: string[] = []

    const mid1: Middleware = () => dispatch => action => {
      queue.push('mid1')
      dispatch(action)
    }

    const mid2: Middleware = () => dispatch => action => {
      queue.push('mid2')
      dispatch(action)
    }

    const mid3: Middleware = () => dispatch => action => {
      queue.push('mid3')
      dispatch(action)
    }

    const egg1: Egg = { id: 'egg1', middlewares: [mid1] }
    const egg2: Egg = { id: 'egg2', middlewares: [mid1] }
    const egg3: Egg = { id: 'egg3', middlewares: [mid2, mid3] }

    const store = createStore()

    const anyAction: Action<'any-type'> = { type: 'any-type' }

    const removers: RemoveAddedEggs[] = []

    removers.push(store.addEggs(egg1, egg2))
    store.dispatch(anyAction)
    expect(queue).toEqual(['mid1'])
    store.dispatch(anyAction)
    expect(queue).toEqual(['mid1', 'mid1'])
    queue = []

    removers.push(store.addEggs(egg1, egg2))
    removers.push(store.addEggs(egg3))
    store.dispatch(anyAction)
    expect(queue).toEqual(['mid1', 'mid2', 'mid3'])
    queue = []

    removers.pop()?.()
    store.dispatch(anyAction)
    expect(queue).toEqual(['mid1'])
    queue = []

    removers.pop()?.()
    store.dispatch(anyAction)
    expect(queue).toEqual(['mid1'])
    queue = []

    removers.pop()?.()
    store.dispatch(anyAction)
    expect(queue).toEqual([])

    expect(removers.length).toBe(0)
  })

  test('Middlewares from extensions should work', () => {
    const egg1: Egg = { id: 'egg1', reducersMap: { egg1: () => ({}) } }
    const egg2: Egg = { id: 'egg2', reducersMap: { egg2: () => ({}) } }
    const egg3: Egg = { id: 'egg3', reducersMap: { egg3: () => ({}) } }

    let queue: string[] = []

    const actionChecker = jest.fn()

    const mid1: Middleware = () => dispatch => action => {
      queue.push('mid1')
      actionChecker(action)
      dispatch(action)
    }

    const mid2: Middleware = () => dispatch => action => {
      queue.push('mid2')
      dispatch(action)
    }

    const mid3: Middleware = () => dispatch => action => {
      queue.push('mid3')
      dispatch(action)
    }

    const extension1: Extension = { middleware: mid1 }
    const extension2: Extension = { middleware: mid2 }
    const extension3: Extension = { middleware: mid3 }

    const store = createStore({ extensions: [extension1, extension2, extension3] })

    const removers: RemoveAddedEggs[] = []

    removers.push(store.addEggs())
    removers.pop()?.()
    removers.push(store.addEggs(egg1, egg2))
    expect(queue).toEqual(['mid1', 'mid2', 'mid3'])
    expect(actionChecker).toBeCalledTimes(1)
    expect(actionChecker).nthCalledWith(1, {
      type: '@@eggs/reduce',
      payload: { method: 'add', reducers: ['egg1', 'egg2'] },
    })
    queue = []

    removers.push(store.addEggs(egg1, egg2))
    removers.push(store.addEggs(egg3))
    expect(queue).toEqual(['mid1', 'mid2', 'mid3'])
    expect(actionChecker).toBeCalledTimes(2)
    expect(actionChecker).nthCalledWith(2, {
      type: '@@eggs/reduce',
      payload: { method: 'add', reducers: ['egg3'] },
    })
    queue = []

    removers.pop()?.()
    expect(queue).toEqual(['mid1', 'mid2', 'mid3'])
    expect(actionChecker).toBeCalledTimes(3)
    expect(actionChecker).nthCalledWith(3, {
      type: '@@eggs/reduce',
      payload: { method: 'remove', reducers: ['egg3'] },
    })
    queue = []

    removers.pop()?.()
    expect(queue).toEqual([])
    expect(actionChecker).toBeCalledTimes(3)

    removers.pop()?.()
    expect(queue).toEqual(['mid1', 'mid2', 'mid3'])
    expect(actionChecker).toBeCalledTimes(4)
    expect(actionChecker).nthCalledWith(4, {
      type: '@@eggs/reduce',
      payload: { method: 'remove', reducers: ['egg2', 'egg1'] },
    })

    expect(removers.length).toBe(0)
  })

  test('Middleware from extensions should enhance `dispatch` (thunk example)', async () => {
    const thunkExtension: Extension<ThunkMiddleware> = { middleware: thunk }

    const counterEgg: Egg = {
      id: 'counter-egg',
      reducersMap: {
        counter: (state = 0, action: AnyAction) => {
          if (action.type === 'increment') {
            state += 1
            return state
          }
          return state
        },
      },
    }

    const store = createStore({ extensions: [thunkExtension] })

    store.addEggs(counterEgg)

    {
      const { counterBefore, counterAfter } = await store.dispatch(incrementAsync())
      expect(counterBefore).toBe(0)
      expect(counterAfter).toBe(1)
    }

    {
      const { counterBefore, counterAfter } = await store.dispatch(incrementAsync())
      expect(counterBefore).toBe(1)
      expect(counterAfter).toBe(2)
    }
  })

  test('Enhancers from extensions should work', async () => {
    const counterEgg: Egg = {
      id: 'counter-egg',
      reducersMap: {
        counter: (state = 0, action: AnyAction) => {
          if (action.type === 'increment') {
            state += 1
            return state
          }
          return state
        },
      },
    }

    const egg1: Egg = { id: 'egg1' }
    const egg2: Egg = { id: 'egg2' }

    const trackAdd = jest.fn()
    const trackRemove = jest.fn()
    const spyOnAsyncIncrement = jest.fn()

    const thunkExtension: Extension<ThunkMiddleware> = { middleware: thunk }

    const trackAddEggs: Extension<
      ThunkMiddleware,
      StoreEnhancer<{ trackAdd: (...args: any[]) => void }>,
      ExtensionEventHandler<ThunkMiddleware, StoreEnhancer<{ trackAdd: (...args: any[]) => void }>>
    > = {
      enhancer(next) {
        return (reducer, preloadedState) => {
          return {
            ...next(reducer, preloadedState),
            trackAdd,
          }
        }
      },
      beforeAdd(eggs, store) {
        store.trackAdd(eggs, store)
      },
      afterAdd(_, store) {
        store.dispatch(incrementAsync()).then(result => spyOnAsyncIncrement(result))
      },
    }

    const trackRemoveEggs: Extension<
      ThunkMiddleware,
      StoreEnhancer<{ trackRemove: (...args: any[]) => void }>,
      ExtensionEventHandler<ThunkMiddleware, StoreEnhancer<{ trackRemove: (...args: any[]) => void }>>
    > = {
      enhancer(next) {
        return (reducer, preloadedState) => {
          return {
            ...next(reducer, preloadedState),
            trackRemove,
          }
        }
      },
      beforeRemove(eggs, store) {
        store.trackRemove(eggs, store)
      },
      afterRemove(_, store) {
        store.dispatch(incrementAsync()).then(result => spyOnAsyncIncrement(result))
      },
    }

    const store = createStore({ extensions: [thunkExtension, trackAddEggs, trackRemoveEggs] })

    expect(trackAdd).not.toBeCalled()
    expect(trackRemove).not.toBeCalled()
    expect(spyOnAsyncIncrement).not.toBeCalled()

    store.addEggs(counterEgg)
    expect(trackAdd).toBeCalledTimes(1)
    expect(trackAdd).nthCalledWith(1, [counterEgg], store)
    expect(trackRemove).not.toBeCalled()
    await new Promise(process.nextTick)
    expect(spyOnAsyncIncrement).toBeCalledTimes(1)
    expect(spyOnAsyncIncrement).nthCalledWith(1, { counterBefore: 0, counterAfter: 1 })

    const removers: RemoveAddedEggs[] = []

    removers.push(store.addEggs(egg1))
    expect(trackAdd).toBeCalledTimes(2)
    expect(trackAdd).nthCalledWith(2, [egg1], store)
    expect(trackRemove).not.toBeCalled()
    await new Promise(process.nextTick)
    expect(spyOnAsyncIncrement).toBeCalledTimes(2)
    expect(spyOnAsyncIncrement).nthCalledWith(2, { counterBefore: 1, counterAfter: 2 })

    removers.push(store.addEggs(egg2))

    expect(trackAdd).toBeCalledTimes(3)
    expect(trackAdd).nthCalledWith(3, [egg2], store)
    expect(trackRemove).not.toBeCalled()
    await new Promise(process.nextTick)
    expect(spyOnAsyncIncrement).toBeCalledTimes(3)
    expect(spyOnAsyncIncrement).nthCalledWith(3, { counterBefore: 2, counterAfter: 3 })

    removers.pop()?.()
    expect(trackAdd).toBeCalledTimes(3)
    expect(trackRemove).toBeCalledTimes(1)
    expect(trackRemove).nthCalledWith(1, [egg2], store)
    await new Promise(process.nextTick)
    expect(spyOnAsyncIncrement).toBeCalledTimes(4)
    expect(spyOnAsyncIncrement).nthCalledWith(4, { counterBefore: 3, counterAfter: 4 })

    removers.pop()?.()
    expect(trackAdd).toBeCalledTimes(3)
    expect(trackRemove).toBeCalledTimes(2)
    expect(trackRemove).nthCalledWith(2, [egg1], store)
    await new Promise(process.nextTick)
    expect(spyOnAsyncIncrement).toBeCalledTimes(5)
    expect(spyOnAsyncIncrement).nthCalledWith(5, { counterBefore: 4, counterAfter: 5 })

    expect(removers.length).toBe(0)

    store.trackAdd()
    expect(trackAdd).toBeCalledTimes(4)

    store.trackRemove()
    expect(trackRemove).toBeCalledTimes(3)

    store.dispatch(incrementAsync()).then(result => spyOnAsyncIncrement(result))
    await new Promise(process.nextTick)
    expect(spyOnAsyncIncrement).toBeCalledTimes(6)
    expect(spyOnAsyncIncrement).nthCalledWith(6, { counterBefore: 5, counterAfter: 6 })
  })

  test('Store is initialized with `enhancersComposer`', () => {
    const trackCompose = jest.fn()

    const enhancersComposer = (...args: any[]) => {
      trackCompose(...args)
      return compose(...args)
    }

    createStore({ enhancersComposer })
    expect(trackCompose).toBeCalledTimes(1)
    expect(trackCompose).nthCalledWith(
      1,
      // `coreEnhancer` function
      expect.any(Function),
      // `applyMiddleware` result
      expect.any(Function),
    )

    const extension1: Extension = {
      enhancer: function ext1Enhancer(next) {
        return (reducer, preloadedState) => next(reducer, preloadedState)
      },
    }

    const extension2: Extension = {
      enhancer: function ext2Enhancer(next) {
        return (reducer, preloadedState) => next(reducer, preloadedState)
      },
    }

    createStore({ enhancersComposer, extensions: [extension1, extension2] })
    expect(trackCompose).toBeCalledTimes(2)
    expect(trackCompose).nthCalledWith(
      2,
      // `coreEnhancer` function
      expect.any(Function),
      extension1.enhancer,
      extension2.enhancer,
      // `applyMiddleware` result
      expect.any(Function),
    )
  })
})
