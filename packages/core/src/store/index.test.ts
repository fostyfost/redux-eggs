import type { Action, Middleware, Reducer, ReducersMapObject, Store, StoreEnhancer } from 'redux'
import * as Redux from 'redux'
import { combineReducers, compose } from 'redux'

import type { Egg, EggTuple, Extension } from '@/contracts'
import * as EggTray from '@/egg-tray'
import * as MiddlewareTray from '@/middleware-tray'
import type { StoreCreator } from '@/store'
import { buildStore, REDUCE_ACTION_TYPE } from '@/store'

describe('Tests for store builder', () => {
  const action: Action = { type: REDUCE_ACTION_TYPE }

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

  test('Eggs should be added to and removed from tray correctly', () => {
    const reducersMap1 = { egg1: () => ({}) }
    const reducersMap2 = { egg2: () => ({}) }
    const reducersMap3 = { egg3: () => ({}) }

    const eggs: Egg[] = [
      { id: 'egg1', reducersMap: reducersMap1 },
      { id: 'egg2', reducersMap: reducersMap2 },
      { id: 'egg3', reducersMap: reducersMap3 },
      { id: 'egg4', reducersMap: { ...reducersMap1, ...reducersMap2, ...reducersMap3 } },
      { id: 'egg5' },
    ]

    const calls = Array.from({ length: 3 }, (_, index) => index + 1)

    const store = buildStore(reducer => Redux.createStore(reducer), combineReducers, compose)

    const spyOnDispatch = jest.spyOn(store, 'dispatch')

    expect(spyOnDispatch).not.toBeCalled()
    eggs.forEach(egg => expect(store.getEggCount(egg)).toBe(0))
    expect(Object.keys(store.getState())).toEqual([])

    eggs.forEach(egg => store.addEggs([egg]))
    expect(spyOnDispatch).toBeCalledTimes(3)
    calls.forEach(call => expect(spyOnDispatch).nthCalledWith(call, action))
    eggs.forEach(egg => expect(store.getEggCount(egg)).toBe(1))
    expect(Object.keys(store.getState())).toEqual(['egg1', 'egg2', 'egg3'])
    spyOnDispatch.mockClear()

    eggs.forEach(egg => store.addEggs([egg]))
    expect(spyOnDispatch).not.toBeCalled()
    eggs.forEach(egg => expect(store.getEggCount(egg)).toBe(2))
    expect(Object.keys(store.getState())).toEqual(['egg1', 'egg2', 'egg3'])

    eggs.forEach(egg => store.removeEggs([egg]))
    expect(spyOnDispatch).not.toBeCalled()
    eggs.forEach(egg => expect(store.getEggCount(egg)).toBe(1))
    expect(Object.keys(store.getState())).toEqual(['egg1', 'egg2', 'egg3'])

    eggs
      .slice()
      .reverse()
      .forEach(egg => store.removeEggs([egg]))
    expect(spyOnDispatch).toBeCalledTimes(3)
    calls.forEach(call => expect(spyOnDispatch).nthCalledWith(call, action))
    eggs.forEach(egg => expect(store.getEggCount(egg)).toBe(0))
    expect(Object.keys(store.getState())).toEqual([])
    spyOnDispatch.mockClear()
  })

  test('Eggs without ID are not allowed', () => {
    const addMock = jest.fn()
    const removeMock = jest.fn()

    const clearMocks = () => {
      addMock.mockClear()
      removeMock.mockClear()
    }

    const originalTrayResult = { ...EggTray.getEggTray() }

    const spyOnEggTray = jest.spyOn(EggTray, 'getEggTray')
    spyOnEggTray.mockImplementationOnce(() => ({
      ...originalTrayResult,
      add(eggs: Egg[]) {
        originalTrayResult.add(eggs)
        addMock(eggs)
      },
      remove(eggs: Egg[]) {
        originalTrayResult.remove(eggs)
        removeMock(eggs)
      },
    }))

    const store = buildStore(reducer => Redux.createStore(reducer), combineReducers, compose)

    store.addEggs(undefined as unknown as Egg[])
    expect(addMock).not.toBeCalled()
    expect(removeMock).not.toBeCalled()

    store.addEggs([{} as Egg, {} as Egg, {} as Egg])
    expect(addMock).not.toBeCalled()
    expect(removeMock).not.toBeCalled()

    store.addEggs([{ id: 'egg1' }, {} as Egg, {} as Egg])
    expect(addMock).toBeCalledTimes(1)
    expect(addMock).toBeCalledWith([{ id: 'egg1' }])
    expect(removeMock).not.toBeCalled()
    clearMocks()

    store.addEggs([{} as Egg, [{} as Egg, [{} as Egg, {} as Egg, [{ id: 'egg2' }, [[{ id: 'egg1' }]]]]]])
    expect(addMock).toBeCalledTimes(1)
    expect(addMock).toBeCalledWith([{ id: 'egg2' }, { id: 'egg1' }])
    expect(removeMock).not.toBeCalled()
    clearMocks()

    expect(store.getEggs()).toEqual([
      { count: 2, value: { id: 'egg1' } },
      { count: 1, value: { id: 'egg2' } },
    ])

    store.removeEggs(undefined as unknown as Egg[])
    expect(addMock).not.toBeCalled()
    expect(removeMock).not.toBeCalled()

    store.removeEggs([{} as Egg, {} as Egg, {} as Egg])
    expect(addMock).not.toBeCalled()
    expect(removeMock).not.toBeCalled()

    store.removeEggs([{ id: 'egg1' }, {} as Egg, {} as Egg])
    expect(addMock).not.toBeCalled()
    expect(removeMock).toBeCalledTimes(1)
    expect(removeMock).toBeCalledWith([{ id: 'egg1' }])
    clearMocks()

    store.removeEggs([{} as Egg, [{} as Egg, [{} as Egg, {} as Egg, [{ id: 'egg2' }, [[{ id: 'egg1' }]]]]]])
    expect(addMock).not.toBeCalled()
    expect(removeMock).toBeCalledTimes(1)
    expect(removeMock).toBeCalledWith([{ id: 'egg2' }, { id: 'egg1' }])
    clearMocks()

    expect(store.getEggs()).toEqual([])

    spyOnEggTray.mockRestore()
  })

  test('Store is initialized with middlewares from extensions and middleware from middlewares tray', () => {
    const spyOnApplyMiddleware = jest.spyOn(Redux, 'applyMiddleware')

    const middlewareTray = MiddlewareTray.getMiddlewareTray(compose)

    const spyOnGetMiddlewareTray = jest.spyOn(MiddlewareTray, 'getMiddlewareTray').mockReturnValueOnce(middlewareTray)

    const mid1Callback = jest.fn()
    const mid1: Middleware = () => next => action => {
      mid1Callback()
      next(action)
    }

    const mid2Callback = jest.fn()
    const mid2: Middleware = () => next => action => {
      mid2Callback()
      next(action)
    }

    const mid3Callback = jest.fn()
    const mid3: Middleware = () => next => action => {
      mid3Callback()
      next(action)
    }

    const mid4Callback = jest.fn()
    const mid4: Middleware = () => next => action => {
      mid4Callback()
      next(action)
    }

    const callbacks = [mid1Callback, mid2Callback, mid3Callback, mid4Callback]

    const extension1: Extension = { middlewares: [mid1, mid3] }
    const extension2: Extension = { middlewares: [mid2, mid4] }

    expect(spyOnApplyMiddleware).not.toBeCalled()

    const storeCreator: StoreCreator = (reducer, middlewareEnhancer, _, middlewaresFromExtensions) => {
      return Redux.createStore(reducer, Redux.applyMiddleware(...middlewaresFromExtensions, middlewareEnhancer))
    }

    const store = buildStore(storeCreator, combineReducers, compose, [extension1, extension2])

    expect(spyOnApplyMiddleware).toBeCalledTimes(1)
    expect(spyOnApplyMiddleware).toBeCalledWith(mid1, mid3, mid2, mid4, middlewareTray.mid)
    callbacks.forEach(callback => expect(callback).not.toBeCalled())

    store.dispatch(action)

    callbacks.forEach(callback => expect(callback).toBeCalledTimes(1))

    spyOnApplyMiddleware.mockRestore()
    spyOnGetMiddlewareTray.mockRestore()
  })

  test('Store is initialized with custom `enhancers` from extensions and custom `composer`', () => {
    const spyOnApplyMiddleware = jest.spyOn(Redux, 'applyMiddleware')
    const applyMiddlewareResult: StoreEnhancer<any, any> = createStore => (reducer, initialState) => {
      return createStore(reducer, initialState)
    }
    spyOnApplyMiddleware.mockReturnValueOnce(applyMiddlewareResult)

    const composeEnhancersCallback = jest.fn()
    const enhancerCallback1 = jest.fn()
    const enhancerCallback2 = jest.fn()

    const composer = jest.fn()
    composer.mockImplementation((...fn) => {
      composeEnhancersCallback(...fn)
      return Redux.compose(...fn)
    })

    const enhancer1: StoreEnhancer = createStore => (reducer, initialState) => {
      enhancerCallback1()
      return createStore(reducer, initialState)
    }

    const enhancer2: StoreEnhancer = createStore => (reducer, initialState) => {
      enhancerCallback2()
      return createStore(reducer, initialState)
    }

    expect(composeEnhancersCallback).not.toBeCalled()
    expect(enhancerCallback1).not.toBeCalled()
    expect(enhancerCallback2).not.toBeCalled()

    const storeCreator: StoreCreator = (reducer, middlewareEnhancer, enhancersFromExtensions) => {
      return Redux.createStore(reducer, composer(...enhancersFromExtensions, Redux.applyMiddleware(middlewareEnhancer)))
    }

    buildStore(storeCreator, combineReducers, compose, [{ enhancers: [enhancer1] }, { enhancers: [enhancer2] }])

    expect(composeEnhancersCallback).toBeCalledTimes(1)
    expect(composeEnhancersCallback).toBeCalledWith(enhancer1, enhancer2, applyMiddlewareResult)

    expect(enhancerCallback1).toBeCalledTimes(1)
    expect(enhancerCallback2).toBeCalledTimes(1)

    spyOnApplyMiddleware.mockRestore()
  })

  test('Store is initialized with custom `combiner`', () => {
    const callback = jest.fn()
    const combiner = (reducersMap: ReducersMapObject) => {
      callback({ ...reducersMap })
      return Redux.combineReducers(reducersMap)
    }

    expect(callback).not.toBeCalled()

    const storeCreator: StoreCreator = (reducer, middlewareEnhancer) => {
      return Redux.createStore(reducer, Redux.applyMiddleware(middlewareEnhancer))
    }

    const store = buildStore(storeCreator, combiner, compose, [])

    expect(callback).not.toBeCalled()

    const reducer1: Reducer = () => ({})
    const reducer2: Reducer = () => ({})
    const reducer3: Reducer = () => ({})

    const egg1: Egg = { id: 'egg1', reducersMap: { reducer1, reducer2 } }
    const egg2: Egg = { id: 'egg2', reducersMap: { reducer3 } }

    store.addEggs([egg1, egg2])
    expect(callback).toBeCalledTimes(1)
    expect(callback).toBeCalledWith({ reducer1, reducer2, reducer3 })
    expect(Object.keys(store.getState())).toEqual(['reducer1', 'reducer2', 'reducer3'])
    callback.mockClear()

    store.removeEggs([egg1])
    expect(callback).toBeCalledTimes(1)
    expect(callback).toBeCalledWith({ reducer3 })
    expect(Object.keys(store.getState())).toEqual(['reducer3'])
    callback.mockClear()

    store.removeEggs([egg2])
    expect(callback).toBeCalledTimes(1)
    expect(callback).toBeCalledWith({})
    expect(Object.keys(store.getState())).toEqual([])
  })

  test('Store is initialized with custom `composeMiddlewares`', () => {
    const callback = jest.fn()
    const composeMiddlewares: typeof compose = (...middlewares: any[]) => {
      callback(...middlewares)
      return Redux.compose<any>(...middlewares)
    }

    expect(callback).not.toBeCalled()

    const storeCreator: StoreCreator = (reducer, middlewareEnhancer) => {
      return Redux.createStore(reducer, Redux.applyMiddleware(middlewareEnhancer))
    }

    const store = buildStore(storeCreator, combineReducers, composeMiddlewares, [])

    expect(callback).not.toBeCalled()

    const result1: ReturnType<Middleware> = next => action => next(action)
    const middleware1: Middleware = () => result1

    const result2: ReturnType<Middleware> = next => action => next(action)
    const middleware2: Middleware = () => result2

    const result3: ReturnType<Middleware> = next => action => next(action)
    const middleware3: Middleware = () => result3

    const egg1: Egg = { id: 'egg1', middlewares: [middleware1, middleware3] }
    const egg2: Egg = { id: 'egg2', middlewares: [middleware2] }

    store.addEggs([egg1, egg2])
    store.dispatch({ type: 'test' })
    expect(callback).toBeCalledTimes(1)
    expect(callback).toBeCalledWith(result1, result3, result2)
    callback.mockClear()

    store.removeEggs([egg1])
    store.dispatch({ type: 'test' })
    expect(callback).toBeCalledTimes(1)
    expect(callback).toBeCalledWith(result2)
    callback.mockClear()

    store.removeEggs([egg2])
    store.dispatch({ type: 'test' })
    expect(callback).toBeCalledTimes(1)
    expect(callback).toBeCalledWith()
    expect(Object.keys(store.getState())).toEqual([])
  })

  test('Extension events must be fired when eggs has been added or removed', () => {
    const egg1: Egg = { id: 'egg1', reducersMap: { egg1: () => ({}) } }
    const egg2: Egg = { id: 'egg2' }
    const egg3: Egg = { id: 'egg3' }
    const egg4: Egg = { id: 'egg4' }

    let queue: string[] = []

    const ext1BeforeAdd = jest.fn(() => queue.push('ext1BeforeAdd'))
    const ext1AfterAdd = jest.fn(() => queue.push('ext1AfterAdd'))
    const ext1BeforeRemove = jest.fn(() => queue.push('ext1BeforeRemove'))
    const ext1AfterRemove = jest.fn(() => queue.push('ext1AfterRemove'))
    const ext2BeforeAdd1 = jest.fn(() => queue.push('ext2BeforeAdd1'))
    const ext2BeforeAdd2 = jest.fn(() => queue.push('ext2BeforeAdd2'))
    const ext2AfterAdd1 = jest.fn(() => queue.push('ext2AfterAdd1'))
    const ext2AfterAdd2 = jest.fn(() => queue.push('ext2AfterAdd2'))
    const ext3BeforeRemove = jest.fn(() => queue.push('ext3BeforeRemove'))
    const ext3AfterRemove = jest.fn(() => queue.push('ext3AfterRemove'))

    const extensions: Extension[] = [
      {
        beforeAdd: [ext1BeforeAdd],
        afterAdd: [ext1AfterAdd],
        beforeRemove: [ext1BeforeRemove],
        afterRemove: [ext1AfterRemove],
      },
      {
        beforeAdd: [ext2BeforeAdd1, ext2BeforeAdd2],
        afterAdd: [ext2AfterAdd1, ext2AfterAdd2],
      },
      {
        beforeRemove: [ext3BeforeRemove],
        afterRemove: [ext3AfterRemove],
      },
    ]

    const store = buildStore(reducer => Redux.createStore(reducer), combineReducers, compose, extensions)

    const allEventsNotCalled = () => {
      expect(ext1BeforeAdd).not.toBeCalled()
      expect(ext1AfterAdd).not.toBeCalled()
      expect(ext2BeforeAdd1).not.toBeCalled()
      expect(ext2BeforeAdd2).not.toBeCalled()
      expect(ext2AfterAdd1).not.toBeCalled()
      expect(ext2AfterAdd2).not.toBeCalled()

      expect(ext1BeforeRemove).not.toBeCalled()
      expect(ext1AfterRemove).not.toBeCalled()
      expect(ext3BeforeRemove).not.toBeCalled()
      expect(ext3AfterRemove).not.toBeCalled()

      expect(queue).toEqual([])
    }

    const clearMocks = () => {
      ext1BeforeAdd.mockClear()
      ext1AfterAdd.mockClear()
      ext1BeforeRemove.mockClear()
      ext1AfterRemove.mockClear()
      ext2BeforeAdd1.mockClear()
      ext2BeforeAdd2.mockClear()
      ext2AfterAdd1.mockClear()
      ext2AfterAdd2.mockClear()
      ext3BeforeRemove.mockClear()
      ext3AfterRemove.mockClear()
    }

    const addEventsCalledWith = (eggs: EggTuple) => {
      expect(ext1BeforeAdd).toBeCalledTimes(1)
      expect(ext1BeforeAdd).toBeCalledWith(eggs, store)
      expect(ext1AfterAdd).toBeCalledTimes(1)
      expect(ext1AfterAdd).toBeCalledWith(eggs, store)
      expect(ext2BeforeAdd1).toBeCalledTimes(1)
      expect(ext2BeforeAdd1).toBeCalledWith(eggs, store)
      expect(ext2BeforeAdd2).toBeCalledTimes(1)
      expect(ext2BeforeAdd2).toBeCalledWith(eggs, store)
      expect(ext2AfterAdd1).toBeCalledTimes(1)
      expect(ext2AfterAdd1).toBeCalledWith(eggs, store)
      expect(ext2AfterAdd2).toBeCalledTimes(1)
      expect(ext2AfterAdd2).toBeCalledWith(eggs, store)

      expect(ext1BeforeRemove).not.toBeCalled()
      expect(ext1AfterRemove).not.toBeCalled()
      expect(ext3BeforeRemove).not.toBeCalled()
      expect(ext3AfterRemove).not.toBeCalled()

      expect(queue).toEqual([
        'ext1BeforeAdd',
        'ext2BeforeAdd1',
        'ext2BeforeAdd2',
        'ext1AfterAdd',
        'ext2AfterAdd1',
        'ext2AfterAdd2',
      ])

      clearMocks()
      queue = []
    }

    const removeEventsCalledWith = (eggs: EggTuple) => {
      expect(ext1BeforeAdd).not.toBeCalled()
      expect(ext1AfterAdd).not.toBeCalled()
      expect(ext2BeforeAdd1).not.toBeCalled()
      expect(ext2BeforeAdd2).not.toBeCalled()
      expect(ext2AfterAdd1).not.toBeCalled()
      expect(ext2AfterAdd2).not.toBeCalled()

      expect(ext1BeforeRemove).toBeCalledTimes(1)
      expect(ext1BeforeRemove).toBeCalledWith(eggs, store)

      expect(ext1AfterRemove).toBeCalledTimes(1)
      expect(ext1AfterRemove).toBeCalledWith(eggs, store)

      expect(ext3BeforeRemove).toBeCalledTimes(1)
      expect(ext3BeforeRemove).toBeCalledWith(eggs, store)

      expect(ext3AfterRemove).toBeCalledTimes(1)
      expect(ext3AfterRemove).toBeCalledWith(eggs, store)

      expect(queue).toEqual(['ext1BeforeRemove', 'ext3BeforeRemove', 'ext1AfterRemove', 'ext3AfterRemove'])

      clearMocks()
      queue = []
    }

    allEventsNotCalled()

    store.addEggs([])
    allEventsNotCalled()

    store.removeEggs([])
    allEventsNotCalled()

    store.addEggs([egg1])
    addEventsCalledWith([egg1])

    store.addEggs([egg1])
    allEventsNotCalled()

    store.removeEggs([egg1])
    allEventsNotCalled()

    store.removeEggs([egg2, egg3, egg4])
    allEventsNotCalled()

    store.removeEggs([egg1, egg2, egg3])
    removeEventsCalledWith([egg1])

    store.addEggs([egg1])
    addEventsCalledWith([egg1])

    store.addEggs([egg1, egg2, egg3])
    addEventsCalledWith([egg2, egg3])

    store.removeEggs([egg4])
    allEventsNotCalled()

    store.removeEggs([egg1, egg2, egg3, egg4])
    removeEventsCalledWith([egg2, egg3])

    store.removeEggs([egg1, egg2, egg3, egg4])
    removeEventsCalledWith([egg1])

    expect(store.getEggs()).toEqual([])

    // Check add with tuple
    store.addEggs([[egg2], [[egg1], [[[egg4]]]], egg3])
    addEventsCalledWith([egg2, egg1, egg4, egg3])

    // Check remove with tuple
    store.removeEggs([[egg2], [[egg1], [[[egg4]]]], egg3])
    removeEventsCalledWith([egg2, egg1, egg4, egg3])

    // Check removal reversion
    const removeAddedEggs = store.addEggs([[egg2], [[egg1], [[[egg4]]]], egg3])
    addEventsCalledWith([egg2, egg1, egg4, egg3])

    removeAddedEggs()
    removeEventsCalledWith([egg3, egg4, egg1, egg2])

    removeAddedEggs()
    allEventsNotCalled()

    expect(store.getEggs()).toEqual([])
  })

  test('Eggs events must be fired when eggs has been added or removed', () => {
    let queue: string[] = []

    const egg1BeforeAdd = jest.fn(() => queue.push('egg1BeforeAdd'))
    const egg1AfterAdd = jest.fn(() => queue.push('egg1AfterAdd'))
    const egg1BeforeRemove = jest.fn(() => queue.push('egg1BeforeRemove'))
    const egg1AfterRemove = jest.fn(() => queue.push('egg1AfterRemove'))
    const egg2BeforeAdd = jest.fn(() => queue.push('egg2BeforeAdd'))
    const egg2AfterAdd = jest.fn(() => queue.push('egg2AfterAdd'))
    const egg3BeforeRemove = jest.fn(() => queue.push('egg3BeforeRemove'))
    const egg3AfterRemove = jest.fn(() => queue.push('egg3AfterRemove'))

    const egg1: Egg = {
      id: 'egg1',
      beforeAdd: egg1BeforeAdd,
      afterAdd: egg1AfterAdd,
      beforeRemove: egg1BeforeRemove,
      afterRemove: egg1AfterRemove,
    }

    const egg2: Egg = {
      id: 'egg2',
      beforeAdd: egg2BeforeAdd,
      afterAdd: egg2AfterAdd,
    }

    const egg3: Egg = {
      id: 'egg3',
      beforeRemove: egg3BeforeRemove,
      afterRemove: egg3AfterRemove,
    }

    const egg4: Egg = {
      id: 'egg4',
      beforeAdd: undefined,
      afterAdd: undefined,
      beforeRemove: undefined,
      afterRemove: undefined,
    }

    const store = buildStore(reducer => Redux.createStore(reducer), combineReducers, compose)

    const allEventsNotCalled = () => {
      expect(egg1BeforeAdd).not.toBeCalled()
      expect(egg1AfterAdd).not.toBeCalled()
      expect(egg2BeforeAdd).not.toBeCalled()
      expect(egg2AfterAdd).not.toBeCalled()

      expect(egg1BeforeRemove).not.toBeCalled()
      expect(egg1AfterRemove).not.toBeCalled()
      expect(egg3BeforeRemove).not.toBeCalled()
      expect(egg3AfterRemove).not.toBeCalled()

      expect(queue).toEqual([])
    }

    const clearMocks = () => {
      egg1BeforeAdd.mockClear()
      egg1AfterAdd.mockClear()
      egg1BeforeRemove.mockClear()
      egg1AfterRemove.mockClear()
      egg2BeforeAdd.mockClear()
      egg2AfterAdd.mockClear()
      egg3BeforeRemove.mockClear()
      egg3AfterRemove.mockClear()
    }

    const addEventsCalledWith = (eggs: Egg[]) => {
      if (eggs.includes(egg1)) {
        expect(egg1BeforeAdd).toBeCalledTimes(1)
        expect(egg1BeforeAdd).toBeCalledWith(store)
        expect(egg1AfterAdd).toBeCalledTimes(1)
        expect(egg1AfterAdd).toBeCalledWith(store)
      }

      if (eggs.includes(egg2)) {
        expect(egg2BeforeAdd).toBeCalledTimes(1)
        expect(egg2BeforeAdd).toBeCalledWith(store)
        expect(egg2AfterAdd).toBeCalledTimes(1)
        expect(egg2AfterAdd).toBeCalledWith(store)
      }

      expect(egg1BeforeRemove).not.toBeCalled()
      expect(egg1AfterRemove).not.toBeCalled()
      expect(egg3BeforeRemove).not.toBeCalled()
      expect(egg3AfterRemove).not.toBeCalled()

      const { beforeEvents, afterEvents } = eggs.reduce(
        (acc, egg) => {
          if (egg.beforeAdd) {
            acc.beforeEvents.push(`${egg.id}BeforeAdd`)
          }

          if (egg.afterAdd) {
            acc.afterEvents.push(`${egg.id}AfterAdd`)
          }

          return acc
        },
        { beforeEvents: [] as string[], afterEvents: [] as string[] },
      )

      const expectedQueue = ([] as string[]).concat(beforeEvents, afterEvents)

      expect(queue).toEqual(expectedQueue)

      clearMocks()
      queue = []
    }

    const removeEventsCalledWith = (eggs: Egg[]) => {
      expect(egg1BeforeAdd).not.toBeCalled()
      expect(egg1AfterAdd).not.toBeCalled()
      expect(egg2BeforeAdd).not.toBeCalled()
      expect(egg2AfterAdd).not.toBeCalled()

      if (eggs.includes(egg1)) {
        expect(egg1BeforeRemove).toBeCalledTimes(1)
        expect(egg1BeforeRemove).toBeCalledWith(store)
        expect(egg1AfterRemove).toBeCalledTimes(1)
        expect(egg1AfterRemove).toBeCalledWith(store)
      }

      if (eggs.includes(egg3)) {
        expect(egg3BeforeRemove).toBeCalledTimes(1)
        expect(egg3BeforeRemove).toBeCalledWith(store)
        expect(egg3AfterRemove).toBeCalledTimes(1)
        expect(egg3AfterRemove).toBeCalledWith(store)
      }

      const { beforeEvents, afterEvents } = eggs.reduce(
        (acc, egg) => {
          if (egg.beforeRemove) {
            acc.beforeEvents.push(`${egg.id}BeforeRemove`)
          }

          if (egg.afterRemove) {
            acc.afterEvents.push(`${egg.id}AfterRemove`)
          }

          return acc
        },
        { beforeEvents: [] as string[], afterEvents: [] as string[] },
      )

      const expectedQueue = ([] as string[]).concat(beforeEvents, afterEvents)

      expect(queue).toEqual(expectedQueue)

      clearMocks()
      queue = []
    }

    allEventsNotCalled()

    store.addEggs([])
    allEventsNotCalled()

    store.removeEggs([])
    allEventsNotCalled()

    store.addEggs([egg1])
    addEventsCalledWith([egg1])

    store.addEggs([egg1])
    allEventsNotCalled()

    store.removeEggs([egg1])
    allEventsNotCalled()

    store.removeEggs([egg2, egg3, egg4])
    allEventsNotCalled()

    store.removeEggs([egg1, egg2, egg3])
    removeEventsCalledWith([egg1])

    store.addEggs([egg1])
    addEventsCalledWith([egg1])

    store.addEggs([egg1, egg2, egg3])
    addEventsCalledWith([egg2, egg3])

    store.removeEggs([egg4])
    allEventsNotCalled()

    store.removeEggs([egg1, egg2, egg3, egg4])
    removeEventsCalledWith([egg2, egg3])

    store.removeEggs([egg1, egg2, egg3, egg4])
    removeEventsCalledWith([egg1])

    expect(store.getEggs()).toEqual([])

    // Check add with tuple
    store.addEggs([[egg2], [[egg1], [[[egg4]]]], egg3])
    addEventsCalledWith([egg2, egg1, egg4, egg3])

    // Check remove with tuple
    store.removeEggs([[egg2], [[egg1], [[[egg4]]]], egg3])
    removeEventsCalledWith([egg2, egg1, egg4, egg3])

    // Check removal reversion
    const removeAddedEggs = store.addEggs([[egg2], [[egg1], [[[egg4]]]], egg3])
    addEventsCalledWith([egg2, egg1, egg4, egg3])

    removeAddedEggs()
    removeEventsCalledWith([egg3, egg4, egg1, egg2])

    removeAddedEggs()
    allEventsNotCalled()

    expect(store.getEggs()).toEqual([])
  })

  test('Events are fired in the correct order', () => {
    let eventsChecker: string[] = []

    const extensionBeforeAdd1 = () => eventsChecker.push('extensionBeforeAdd1')
    const extensionBeforeAdd2 = () => eventsChecker.push('extensionBeforeAdd2')
    const extensionAfterAdd1 = () => eventsChecker.push('extensionAfterAdd1')
    const extensionAfterAdd2 = () => eventsChecker.push('extensionAfterAdd2')
    const extensionBeforeRemove1 = () => eventsChecker.push('extensionBeforeRemove1')
    const extensionBeforeRemove2 = () => eventsChecker.push('extensionBeforeRemove2')
    const extensionAfterRemove1 = () => eventsChecker.push('extensionAfterRemove1')
    const extensionAfterRemove2 = () => eventsChecker.push('extensionAfterRemove2')

    const eggBeforeAdd = () => eventsChecker.push('eggBeforeAdd')
    const eggAfterAdd = () => eventsChecker.push('eggAfterAdd')
    const eggBeforeRemove = () => eventsChecker.push('eggBeforeRemove')
    const eggAfterRemove = () => eventsChecker.push('eggAfterRemove')

    const extension: Extension = {
      beforeAdd: [extensionBeforeAdd1, extensionBeforeAdd2],
      afterAdd: [extensionAfterAdd1, extensionAfterAdd2],
      beforeRemove: [extensionBeforeRemove1, extensionBeforeRemove2],
      afterRemove: [extensionAfterRemove1, extensionAfterRemove2],
    }

    const egg: Egg = {
      id: 'egg',
      beforeAdd: eggBeforeAdd,
      afterAdd: eggAfterAdd,
      beforeRemove: eggBeforeRemove,
      afterRemove: eggAfterRemove,
    }

    const store = buildStore(reducer => Redux.createStore(reducer), combineReducers, compose, [extension])

    store.addEggs([egg])
    expect(eventsChecker).toEqual([
      'extensionBeforeAdd1',
      'extensionBeforeAdd2',
      'eggBeforeAdd',
      'extensionAfterAdd1',
      'extensionAfterAdd2',
      'eggAfterAdd',
    ])

    eventsChecker = []

    store.removeEggs([egg])
    expect(eventsChecker).toEqual([
      'extensionBeforeRemove1',
      'extensionBeforeRemove2',
      'eggBeforeRemove',
      'extensionAfterRemove1',
      'extensionAfterRemove2',
      'eggAfterRemove',
    ])
  })

  test('Extensions can enhance store', () => {
    const method1 = jest.fn()
    const method2 = jest.fn()
    const value1 = 'some-value-1'
    const value2 = 'some-value-2'

    const enhanceStore1: StoreEnhancer<any> = createStore => (reducer, preloadedState) => {
      const store = createStore(reducer, preloadedState)
      return { ...store, method1, value1 }
    }
    const enhanceStore2: StoreEnhancer<any> = createStore => (reducer, preloadedState) => {
      const store = createStore(reducer, preloadedState)
      return { ...store, method2, value2 }
    }

    type Ext = {
      method1: () => void
      method2: () => void
      value1: string
      value2: string
    }

    const store = buildStore<Store & Ext>(
      (reducer, _, enhancersFromExtensions) => Redux.createStore(reducer, compose(...enhancersFromExtensions)),
      combineReducers,
      compose,
      [{ enhancers: [enhanceStore1] }, { enhancers: [enhanceStore2] }],
    )

    store.method1()
    expect(method1).toBeCalledTimes(1)

    store.method2()
    expect(method2).toBeCalledTimes(1)

    expect(store.value1).toBe(value1)
    expect(store.value2).toBe(value2)
  })
})
