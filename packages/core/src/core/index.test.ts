import type {
  AnyMiddleware,
  AnyReducersMapObject,
  AnyStoreEnhancer,
  Egg,
  EggTray,
  EggTuple,
  Extension,
  MiddlewareTray,
  ReducerTray,
  RemoveAddedEggs,
} from '@/contracts'
import { getCore } from '@/core'
import * as EggTrayModule from '@/egg-tray'
import * as MiddlewareTrayModule from '@/middleware-tray'
import * as ReducerTrayModule from '@/reducer-tray'

describe('Core tests', () => {
  const getMockedEggTrayGetter = () => {
    let mockedEggTray = {} as EggTray

    const { getEggTray } = jest.requireActual('@/egg-tray')

    const spyOnEggTray = jest.spyOn(EggTrayModule, 'getEggTray')
    spyOnEggTray.mockImplementationOnce((...args) => {
      const tray = getEggTray(...args)

      mockedEggTray = {
        ...tray,
        add: jest.fn(tray.add),
        remove: jest.fn(tray.remove),
      }

      return mockedEggTray
    })

    return () => mockedEggTray
  }

  const getMockedReducerTrayGetter = () => {
    let mockedReducerTray = {} as ReducerTray

    const { getReducerTray } = jest.requireActual('@/reducer-tray')

    const spyOnReducerTray = jest.spyOn(ReducerTrayModule, 'getReducerTray')
    spyOnReducerTray.mockImplementationOnce((...args) => {
      const tray = getReducerTray(...args)

      mockedReducerTray = {
        ...tray,
        add: jest.fn(tray.add),
        remove: jest.fn(tray.remove),
      }

      return mockedReducerTray
    })

    return () => mockedReducerTray
  }

  const getMockedMiddlewareTrayGetter = () => {
    let mockedMiddlewareTray = {} as MiddlewareTray

    const { getMiddlewareTray } = jest.requireActual('@/middleware-tray')

    const spyOnReducerTray = jest.spyOn(MiddlewareTrayModule, 'getMiddlewareTray')
    spyOnReducerTray.mockImplementationOnce((...args) => {
      const tray = getMiddlewareTray(...args)

      mockedMiddlewareTray = {
        ...tray,
        add: jest.fn(tray.add),
        remove: jest.fn(tray.remove),
      }

      return mockedMiddlewareTray
    })

    return () => mockedMiddlewareTray
  }

  test('Args should be passed to correct trays', () => {
    const spyOnEggTray = jest.spyOn(EggTrayModule, 'getEggTray')
    const spyOnReducerTray = jest.spyOn(ReducerTrayModule, 'getReducerTray')
    const spyOnMiddlewareTray = jest.spyOn(MiddlewareTrayModule, 'getMiddlewareTray')

    const anyReducerCombiner = jest.fn()
    const anyMiddlewareComposer = jest.fn()

    getCore(anyReducerCombiner, anyMiddlewareComposer, jest.fn())

    expect(spyOnEggTray).toBeCalledWith(...[])
    expect(spyOnReducerTray).toBeCalledWith(anyReducerCombiner)
    expect(spyOnMiddlewareTray).toBeCalledWith(anyMiddlewareComposer)

    spyOnEggTray.mockClear()
    spyOnReducerTray.mockClear()
    spyOnMiddlewareTray.mockClear()
  })

  test('Eggs should be added to and removed from tray correctly', () => {
    const getEggTray = getMockedEggTrayGetter()

    const egg1: Egg = { id: '1' }
    const egg2: Egg = { id: '2' }

    const store = getCore(jest.fn(), jest.fn(), jest.fn()).coreEnhancer(() => ({}))()

    const removers: RemoveAddedEggs[] = []

    removers.push(store.addEggs([]))
    expect(store.getEggs()).toEqual([])
    expect(getEggTray().add).not.toBeCalled()

    removers.pop()?.()
    expect(store.getEggs()).toEqual([])
    expect(getEggTray().remove).not.toBeCalled()

    removers.push(store.addEggs([egg1, egg2]))
    expect(store.getEggs()).toEqual([
      { count: 1, value: egg1 },
      { count: 1, value: egg2 },
    ])
    expect(getEggTray().add).toBeCalledTimes(1)
    expect(getEggTray().add).nthCalledWith(1, [egg1, egg2])

    removers.push(store.addEggs(egg1, egg2))
    expect(store.getEggs()).toEqual([
      { count: 2, value: egg1 },
      { count: 2, value: egg2 },
    ])
    expect(store.getEggCount(egg1)).toBe(2)
    expect(store.getEggCount(egg2)).toBe(2)
    expect(getEggTray().add).toBeCalledTimes(2)
    expect(getEggTray().add).nthCalledWith(2, [egg1, egg2])

    removers.push(store.addEggs([]))
    expect(store.getEggs()).toEqual([
      { count: 2, value: egg1 },
      { count: 2, value: egg2 },
    ])
    expect(getEggTray().add).toBeCalledTimes(2)

    removers.pop()?.()
    expect(store.getEggs()).toEqual([
      { count: 2, value: egg1 },
      { count: 2, value: egg2 },
    ])
    expect(getEggTray().remove).not.toBeCalled()

    removers.pop()?.()
    expect(store.getEggs()).toEqual([
      { count: 1, value: egg1 },
      { count: 1, value: egg2 },
    ])
    expect(getEggTray().remove).toBeCalledTimes(1)
    expect(getEggTray().remove).nthCalledWith(1, [egg2, egg1])

    removers.pop()?.()
    expect(store.getEggs()).toEqual([])
    expect(store.getEggCount(egg1)).toBe(0)
    expect(store.getEggCount(egg2)).toBe(0)
    expect(getEggTray().remove).toBeCalledTimes(2)
    expect(getEggTray().remove).nthCalledWith(2, [egg2, egg1])

    expect(removers.length).toBe(0)
  })

  test('Eggs with `keep = true` property should not be removed from tray', () => {
    const getEggTray = getMockedEggTrayGetter()

    const egg1: Egg = { id: '1', keep: true }
    const egg2: Egg = { id: '2' }

    const store = getCore(jest.fn(), jest.fn(), jest.fn()).coreEnhancer(() => ({}))()

    const removers: RemoveAddedEggs[] = []

    removers.push(store.addEggs([egg1, egg2]))
    expect(store.getEggs()).toEqual([
      { count: Infinity, value: egg1 },
      { count: 1, value: egg2 },
    ])
    expect(store.getEggCount(egg1)).toBe(Infinity)
    expect(store.getEggCount(egg2)).toBe(1)
    expect(getEggTray().add).toBeCalledTimes(1)
    expect(getEggTray().add).nthCalledWith(1, [egg1, egg2])

    removers.push(store.addEggs([egg1, egg2]))
    expect(store.getEggs()).toEqual([
      { count: Infinity, value: egg1 },
      { count: 2, value: egg2 },
    ])
    expect(getEggTray().add).toBeCalledTimes(2)
    expect(getEggTray().add).nthCalledWith(2, [egg1, egg2])

    removers.pop()?.()
    expect(store.getEggs()).toEqual([
      { count: Infinity, value: egg1 },
      { count: 1, value: egg2 },
    ])
    expect(getEggTray().remove).toBeCalledTimes(1)
    expect(getEggTray().remove).nthCalledWith(1, [egg2, egg1])

    removers.pop()?.()
    expect(store.getEggs()).toEqual([{ count: Infinity, value: egg1 }])
    expect(store.getEggCount(egg1)).toBe(Infinity)
    expect(store.getEggCount(egg2)).toBe(0)
    expect(getEggTray().remove).toBeCalledTimes(2)
    expect(getEggTray().remove).nthCalledWith(2, [egg2, egg1])

    expect(removers.length).toBe(0)
  })

  test('One eggs deletion per one eggs addition', () => {
    const getEggTray = getMockedEggTrayGetter()

    const egg1: Egg = { id: '1' }
    const egg2: Egg = { id: '2' }

    const store = getCore(jest.fn(), jest.fn(), jest.fn()).coreEnhancer(() => ({}))()

    const removers: RemoveAddedEggs[] = []

    removers.push(store.addEggs([egg1, egg2]))
    removers.push(store.addEggs([egg1, egg2]))

    expect(store.getEggs()).toEqual([
      { count: 2, value: egg1 },
      { count: 2, value: egg2 },
    ])

    const lastRemover = removers.pop() as RemoveAddedEggs

    lastRemover()

    expect(store.getEggs()).toEqual([
      { count: 1, value: egg1 },
      { count: 1, value: egg2 },
    ])
    expect(getEggTray().remove).toBeCalledTimes(1)
    expect(getEggTray().remove).nthCalledWith(1, [egg2, egg1])

    lastRemover()
    lastRemover()
    lastRemover()

    expect(store.getEggs()).toEqual([
      { count: 1, value: egg1 },
      { count: 1, value: egg2 },
    ])
    expect(getEggTray().remove).toBeCalledTimes(1)

    removers.pop()?.()

    expect(store.getEggs()).toEqual([])
    expect(getEggTray().remove).toBeCalledTimes(2)
    expect(getEggTray().remove).nthCalledWith(2, [egg2, egg1])

    expect(removers.length).toBe(0)
  })

  test('Nested eggs should be flattened', () => {
    const getEggTray = getMockedEggTrayGetter()

    const egg1: Egg = { id: '1' }
    const egg2: Egg = { id: '2' }
    const egg3: Egg = { id: '3' }
    const getEggs = (): EggTuple => [egg3, { id: '5' }]
    const tuple1: EggTuple = [{ id: '4' }, getEggs()]
    const tuple2: EggTuple = [[[{ id: '6' }]], { id: '7' }, [egg3, egg2, egg1]]
    const tuple3: EggTuple = [{ id: '8' }, getEggs()]

    const store = getCore(jest.fn(), jest.fn(), jest.fn()).coreEnhancer(() => ({}))()

    const removers: RemoveAddedEggs[] = []

    removers.push(store.addEggs(egg1, egg2, egg3, tuple1, tuple2, tuple3))

    expect(store.getEggs()).toEqual([
      { count: 1, value: { id: '1' } },
      { count: 1, value: { id: '2' } },
      { count: 1, value: { id: '3' } },
      { count: 1, value: { id: '4' } },
      { count: 1, value: { id: '5' } },
      { count: 1, value: { id: '6' } },
      { count: 1, value: { id: '7' } },
      { count: 1, value: { id: '8' } },
    ])
    expect(getEggTray().add).toBeCalledTimes(1)
    expect(getEggTray().add).nthCalledWith(1, [
      { id: '1' },
      { id: '2' },
      { id: '3' },
      { id: '4' },
      { id: '5' },
      { id: '6' },
      { id: '7' },
      { id: '8' },
    ])

    removers.pop()?.()
    expect(store.getEggs()).toEqual([])
    expect(getEggTray().remove).toBeCalledTimes(1)
    expect(getEggTray().remove).nthCalledWith(1, [
      { id: '8' },
      { id: '7' },
      { id: '6' },
      { id: '5' },
      { id: '4' },
      { id: '3' },
      { id: '2' },
      { id: '1' },
    ])

    expect(removers.length).toBe(0)
  })

  test('IDs as Symbols are allowed', () => {
    const egg1: Egg = { id: Symbol() }
    const egg2: Egg = { id: Symbol('any symbol') }

    const store = getCore(jest.fn(), jest.fn(), jest.fn()).coreEnhancer(() => ({}))()

    const remover = store.addEggs(egg1, egg2, egg1, egg2)
    expect(store.getEggs()).toEqual([
      { count: 1, value: egg1 },
      { count: 1, value: egg2 },
    ])
    expect(store.getEggCount(egg1)).toBe(1)
    expect(store.getEggCount(egg2)).toBe(1)

    remover()
    expect(store.getEggs()).toEqual([])
    expect(store.getEggCount(egg1)).toBe(0)
    expect(store.getEggCount(egg2)).toBe(0)
  })

  test('Eggs without ID are ignored', () => {
    const getEggTray = getMockedEggTrayGetter()

    const egg1 = {} as Egg
    const egg2 = {} as Egg
    const egg3: Egg = { id: '3' }

    const store = getCore(jest.fn(), jest.fn(), jest.fn()).coreEnhancer(() => ({}))()

    const remover = store.addEggs(egg1, egg2, egg3)
    expect(store.getEggs()).toEqual([{ count: 1, value: egg3 }])
    expect(getEggTray().add).toBeCalledTimes(1)
    expect(getEggTray().add).nthCalledWith(1, [egg3])

    remover()
    expect(store.getEggs()).toEqual([])
    expect(getEggTray().remove).toBeCalledTimes(1)
    expect(getEggTray().remove).nthCalledWith(1, [egg3])
  })

  test('Store object should be enhanced', () => {
    const anyMethod = jest.fn()

    const anyStoreCreator = jest.fn(() => ({ anyMethod, getEggs: 'noop' }))

    const arg1 = jest.fn()
    const arg2 = { test: true }

    const store = getCore(jest.fn(), jest.fn(), jest.fn()).coreEnhancer(anyStoreCreator)(arg1, arg2)

    expect(store).toEqual({
      anyMethod,
      getEggs: expect.any(Function),
      getEggCount: expect.any(Function),
      addEggs: expect.any(Function),
    })
    expect(anyStoreCreator).toBeCalledTimes(1)
    expect(anyStoreCreator).nthCalledWith(1, arg1, arg2)
  })

  test('Reducers should be added to and removed from tray correctly', () => {
    const getReducerTray = getMockedReducerTrayGetter()

    const map1: AnyReducersMapObject = { reducer1: jest.fn() }
    const map2: AnyReducersMapObject = { reducer2: jest.fn() }
    const map3: AnyReducersMapObject = { reducer3: jest.fn() }
    const map4: AnyReducersMapObject = { reducer4: jest.fn() }

    const egg1: Egg = { id: '1' }
    const egg2: Egg = { id: '2', reducersMap: { ...map1, ...map2 } }
    const egg3: Egg = { id: '3', reducersMap: { ...map3, ...map4 } }
    const egg4: Egg = { id: '4', reducersMap: { ...map1, ...map3 } }

    const store = getCore(jest.fn(), jest.fn(), jest.fn()).coreEnhancer(() => ({}))()

    const removers: RemoveAddedEggs[] = []

    removers.push(store.addEggs(egg1))
    expect(getReducerTray().add).not.toBeCalled()

    removers.push(store.addEggs(egg2, egg3))
    expect(getReducerTray().add).toBeCalledTimes(1)
    expect(getReducerTray().add).nthCalledWith(1, [
      Object.entries(map1)[0],
      Object.entries(map2)[0],
      Object.entries(map3)[0],
      Object.entries(map4)[0],
    ])

    removers.push(store.addEggs(egg2, egg3))
    expect(getReducerTray().add).toBeCalledTimes(1)

    removers.push(store.addEggs(egg1, egg4))
    expect(getReducerTray().add).toBeCalledTimes(2)
    expect(getReducerTray().add).nthCalledWith(2, [Object.entries(map1)[0], Object.entries(map3)[0]])

    removers.push(store.addEggs(egg1))
    expect(getReducerTray().add).toBeCalledTimes(2)

    removers.pop()?.()
    expect(getReducerTray().remove).not.toBeCalled()

    removers.pop()?.()
    expect(getReducerTray().remove).toBeCalledTimes(1)
    expect(getReducerTray().remove).nthCalledWith(1, [Object.entries(map1)[0], Object.entries(map3)[0]])

    removers.pop()?.()
    expect(getReducerTray().remove).toBeCalledTimes(1)

    removers.pop()?.()
    expect(getReducerTray().remove).toBeCalledTimes(2)
    expect(getReducerTray().remove).nthCalledWith(2, [
      Object.entries(map3)[0],
      Object.entries(map4)[0],
      Object.entries(map1)[0],
      Object.entries(map2)[0],
    ])

    removers.pop()?.()
    expect(getReducerTray().remove).toBeCalledTimes(2)

    expect(removers.length).toBe(0)
  })

  test('`reduceHandler` should be called if necessary', () => {
    const reduceHandler = jest.fn()

    const map1: AnyReducersMapObject = { reducer1: jest.fn() }
    const map2: AnyReducersMapObject = { reducer2: jest.fn() }
    const map3: AnyReducersMapObject = { reducer3: jest.fn() }
    const map4: AnyReducersMapObject = { reducer4: jest.fn() }

    const egg1: Egg = { id: '1' }
    const egg2: Egg = { id: '2', reducersMap: { ...map1, ...map2 } }
    const egg3: Egg = { id: '3', reducersMap: { ...map3, ...map4 } }
    const egg4: Egg = { id: '4', reducersMap: { ...map1, ...map3 } }

    const store = getCore(jest.fn(), jest.fn(), reduceHandler).coreEnhancer(() => ({}))()

    const removers: RemoveAddedEggs[] = []

    removers.push(store.addEggs(egg1))
    expect(reduceHandler).not.toBeCalled()

    removers.push(store.addEggs(egg2, egg3))
    expect(reduceHandler).toBeCalledTimes(1)
    expect(reduceHandler).nthCalledWith(1, store, 'add', [
      Object.entries(map1)[0],
      Object.entries(map2)[0],
      Object.entries(map3)[0],
      Object.entries(map4)[0],
    ])

    removers.push(store.addEggs(egg2, egg3))
    expect(reduceHandler).toBeCalledTimes(1)

    removers.push(store.addEggs(egg1, egg4))
    expect(reduceHandler).toBeCalledTimes(1)

    removers.push(store.addEggs(egg1))
    expect(reduceHandler).toBeCalledTimes(1)

    removers.pop()?.()
    expect(reduceHandler).toBeCalledTimes(1)

    removers.pop()?.()
    expect(reduceHandler).toBeCalledTimes(1)

    removers.pop()?.()
    expect(reduceHandler).toBeCalledTimes(1)

    removers.pop()?.()
    expect(reduceHandler).toBeCalledTimes(2)
    expect(reduceHandler).nthCalledWith(2, store, 'remove', [
      Object.entries(map3)[0],
      Object.entries(map4)[0],
      Object.entries(map1)[0],
      Object.entries(map2)[0],
    ])

    removers.pop()?.()
    expect(reduceHandler).toBeCalledTimes(2)

    expect(removers.length).toBe(0)
  })

  test('Middlewares should be added to and removed from tray correctly', () => {
    const getMiddlewareTray = getMockedMiddlewareTrayGetter()

    const mid1: AnyMiddleware = jest.fn()
    const mid2: AnyMiddleware = jest.fn()
    const mid3: AnyMiddleware = jest.fn()
    const mid4: AnyMiddleware = jest.fn()

    const egg1: Egg = { id: '1' }
    const egg2: Egg = { id: '2', middlewares: [mid1, mid2] }
    const egg3: Egg = { id: '3', middlewares: [mid3, mid4] }
    const egg4: Egg = { id: '4', middlewares: [mid1, mid3] }

    const store = getCore(jest.fn(), jest.fn(), jest.fn()).coreEnhancer(() => ({}))()

    const removers: RemoveAddedEggs[] = []

    removers.push(store.addEggs(egg1))
    expect(getMiddlewareTray().add).not.toBeCalled()

    removers.push(store.addEggs(egg2, egg3))
    expect(getMiddlewareTray().add).toBeCalledTimes(1)
    expect(getMiddlewareTray().add).nthCalledWith(1, [mid1, mid2, mid3, mid4])

    removers.push(store.addEggs(egg2, egg3))
    expect(getMiddlewareTray().add).toBeCalledTimes(1)

    removers.push(store.addEggs(egg1, egg4))
    expect(getMiddlewareTray().add).toBeCalledTimes(2)
    expect(getMiddlewareTray().add).nthCalledWith(2, [mid1, mid3])

    removers.push(store.addEggs(egg1))
    expect(getMiddlewareTray().add).toBeCalledTimes(2)

    removers.pop()?.()
    expect(getMiddlewareTray().remove).not.toBeCalled()

    removers.pop()?.()
    expect(getMiddlewareTray().remove).toBeCalledTimes(1)
    expect(getMiddlewareTray().remove).nthCalledWith(1, [mid1, mid3])

    removers.pop()?.()
    expect(getMiddlewareTray().remove).toBeCalledTimes(1)

    removers.pop()?.()
    expect(getMiddlewareTray().remove).toBeCalledTimes(2)
    expect(getMiddlewareTray().remove).nthCalledWith(2, [mid3, mid4, mid1, mid2])

    removers.pop()?.()
    expect(getMiddlewareTray().remove).toBeCalledTimes(2)

    expect(removers.length).toBe(0)
  })

  test('Core should contain middlewares from extensions', () => {
    expect(getCore(jest.fn(), jest.fn(), jest.fn()).middlewares).toEqual([])
    expect(getCore(jest.fn(), jest.fn(), jest.fn(), []).middlewares).toEqual([])
    expect(getCore(jest.fn(), jest.fn(), jest.fn(), [{}, {}]).middlewares).toEqual([])

    const middleware1: AnyMiddleware = jest.fn()
    const middleware2: AnyMiddleware = jest.fn()
    const middleware3: AnyMiddleware = jest.fn()

    // No deduplication
    expect(
      getCore(jest.fn(), jest.fn(), jest.fn(), [
        { middleware: middleware1 },
        { middleware: middleware1 },
        { middleware: middleware2 },
        { middleware: middleware3 },
      ]).middlewares,
    ).toEqual([middleware1, middleware1, middleware2, middleware3])
  })

  test('Core should contain enhancers from extensions', () => {
    expect(getCore(jest.fn(), jest.fn(), jest.fn()).enhancers).toEqual([])
    expect(getCore(jest.fn(), jest.fn(), jest.fn(), []).enhancers).toEqual([])
    expect(getCore(jest.fn(), jest.fn(), jest.fn(), [{}, {}]).enhancers).toEqual([])

    const enhancer1: AnyStoreEnhancer = jest.fn()
    const enhancer2: AnyStoreEnhancer = jest.fn()
    const enhancer3: AnyStoreEnhancer = jest.fn()

    // No deduplication
    expect(
      getCore(jest.fn(), jest.fn(), jest.fn(), [
        { enhancer: enhancer1 },
        { enhancer: enhancer1 },
        { enhancer: enhancer2 },
        { enhancer: enhancer3 },
      ]).enhancers,
    ).toEqual([enhancer1, enhancer1, enhancer2, enhancer3])
  })

  test('Events must be fired when eggs has been added or removed', () => {
    let queue: string[] = []
    const push = (log: string) => queue.push(log)

    const egg1Id = Symbol('1')
    const egg1: Egg = {
      id: egg1Id,
      beforeAdd: () => push('egg 1 before add'),
      afterAdd: () => push('egg 1 after add'),
      beforeRemove: () => push('egg 1 before remove'),
      afterRemove: () => push('egg 1 after remove'),
    }

    const egg2Id = Symbol('2')
    const egg2: Egg = {
      id: egg2Id,
      beforeAdd: () => push('egg 2 before add'),
      afterAdd: () => push('egg 2 after add'),
      beforeRemove: () => push('egg 2 before remove'),
      afterRemove: () => push('egg 2 after remove'),
    }

    const extensions: Extension[] = [
      {
        beforeAdd() {
          push('extension 1 before add')
        },
        afterAdd() {
          push('extension 1 after add')
        },
        beforeRemove() {
          push('extension 1 before remove')
        },
        afterRemove() {
          push('extension 1 after remove')
        },
      },
      {
        beforeAdd() {
          push('extension 2 before add')
        },
        afterAdd() {
          push('extension 2 after add')
        },
        beforeRemove() {
          push('extension 2 before remove')
        },
        afterRemove() {
          push('extension 2 after remove')
        },
      },
    ]

    const store = getCore(jest.fn(), jest.fn(), jest.fn(), extensions).coreEnhancer(() => ({}))()

    const removers: RemoveAddedEggs[] = []

    removers.push(store.addEggs([]))
    removers.pop()?.()
    expect(queue).toEqual([])

    removers.push(store.addEggs(egg1, egg2, [egg1, egg2]))
    removers.push(store.addEggs(egg1, egg2))
    expect(queue).toEqual([
      'extension 1 before add',
      'extension 2 before add',
      'egg 1 before add',
      'egg 2 before add',
      'extension 1 after add',
      'extension 2 after add',
      'egg 1 after add',
      'egg 2 after add',
    ])

    queue = []

    removers.push(store.addEggs([]))
    removers.pop()?.()
    removers.pop()?.()
    expect(queue).toEqual([])

    removers.pop()?.()
    expect(queue).toEqual([
      'extension 1 before remove',
      'extension 2 before remove',
      'egg 2 before remove',
      'egg 1 before remove',
      'extension 1 after remove',
      'extension 2 after remove',
      'egg 2 after remove',
      'egg 1 after remove',
    ])

    expect(removers.length).toBe(0)
  })

  test('Events must be fired with correct args', () => {
    const egg1beforeAdd = jest.fn()
    const egg1afterAdd = jest.fn()
    const egg1beforeRemove = jest.fn()
    const egg1afterRemove = jest.fn()

    const egg2beforeAdd = jest.fn()
    const egg2afterAdd = jest.fn()
    const egg2beforeRemove = jest.fn()
    const egg2afterRemove = jest.fn()

    const extension1beforeAdd = jest.fn()
    const extension1afterAdd = jest.fn()
    const extension1beforeRemove = jest.fn()
    const extension1afterRemove = jest.fn()

    const extension2beforeAdd = jest.fn()
    const extension2afterAdd = jest.fn()
    const extension2beforeRemove = jest.fn()
    const extension2afterRemove = jest.fn()

    const egg1Id = Symbol('1')
    const egg1: Egg = {
      id: egg1Id,
      beforeAdd: egg1beforeAdd,
      afterAdd: egg1afterAdd,
      beforeRemove: egg1beforeRemove,
      afterRemove: egg1afterRemove,
    }

    const egg2Id = Symbol('2')
    const egg2: Egg = {
      id: egg2Id,
      beforeAdd: egg2beforeAdd,
      afterAdd: egg2afterAdd,
      beforeRemove: egg2beforeRemove,
      afterRemove: egg2afterRemove,
    }

    const extensions: Extension[] = [
      {
        beforeAdd: extension1beforeAdd,
        afterAdd: extension1afterAdd,
        beforeRemove: extension1beforeRemove,
        afterRemove: extension1afterRemove,
      },
      {
        beforeAdd: extension2beforeAdd,
        afterAdd: extension2afterAdd,
        beforeRemove: extension2beforeRemove,
        afterRemove: extension2afterRemove,
      },
    ]

    const deepFlat = <T extends any[]>(arr: T) => arr.flat(Infinity)

    const eggsAddEvents = deepFlat([egg1, egg2].map(egg => [egg.beforeAdd, egg.afterAdd]))
    const eggsRemoveEvents = deepFlat([egg1, egg2].map(egg => [egg.beforeRemove, egg.afterRemove]))
    const extensionsAddEvents = deepFlat(extensions.map(ext => [ext.beforeAdd, ext.afterAdd]))
    const extensionsRemoveEvents = deepFlat(extensions.map(ext => [ext.beforeRemove, ext.afterRemove]))

    const store = getCore(jest.fn(), jest.fn(), jest.fn(), extensions).coreEnhancer(() => ({}))()

    const removers: RemoveAddedEggs[] = []

    removers.push(store.addEggs([]))
    removers.pop()?.()
    deepFlat([eggsAddEvents, eggsRemoveEvents, extensionsAddEvents, extensionsRemoveEvents]).forEach(evt => {
      expect(evt).not.toBeCalled()
    })

    removers.push(store.addEggs(egg1, egg2, [egg1, egg2]))
    removers.push(store.addEggs([egg1, egg2]))
    eggsAddEvents.forEach(evt => {
      expect(evt).toBeCalledTimes(1)
      expect(evt).nthCalledWith(1, store)
    })
    extensionsAddEvents.forEach(evt => {
      expect(evt).toBeCalledTimes(1)
      expect(evt).nthCalledWith(1, [egg1, egg2], store)
    })
    deepFlat([eggsRemoveEvents, extensionsRemoveEvents]).forEach(evt => {
      expect(evt).not.toBeCalled()
    })

    removers.push(store.addEggs([]))
    removers.pop()?.()
    removers.pop()?.()
    deepFlat([eggsAddEvents, extensionsAddEvents]).forEach(evt => {
      expect(evt).toBeCalledTimes(1)
    })
    deepFlat([eggsRemoveEvents, extensionsRemoveEvents]).forEach(evt => {
      expect(evt).not.toBeCalled()
    })

    removers.pop()?.()
    deepFlat([eggsAddEvents, extensionsAddEvents]).forEach(evt => {
      expect(evt).toBeCalledTimes(1)
    })
    eggsRemoveEvents.forEach(evt => {
      expect(evt).toBeCalledTimes(1)
      expect(evt).nthCalledWith(1, store)
    })
    extensionsRemoveEvents.forEach(evt => {
      expect(evt).toBeCalledTimes(1)
      expect(evt).nthCalledWith(1, [egg2, egg1], store)
    })

    expect(removers.length).toBe(0)
  })
})
