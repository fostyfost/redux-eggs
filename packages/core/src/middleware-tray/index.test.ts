import type { AnyFn, AnyMiddleware, Counter, CounterItem } from '@/contracts'
import * as CounterModule from '@/counter'
import { getMiddlewareTray } from '@/middleware-tray'

describe('Tests for middleware tray', () => {
  const buildCounterGetter = () => {
    let mockedCounter: Counter<AnyMiddleware>

    const { getCounter } = jest.requireActual('@/counter')

    jest.spyOn(CounterModule, 'getCounter').mockImplementationOnce((...args) => {
      mockedCounter = getCounter(...args)
      return mockedCounter
    })

    return () => mockedCounter
  }

  const getMiddlewareComposer = () => {
    return jest.fn((...middlewares: AnyMiddleware[]) => {
      if (middlewares.length === 0) {
        return (arg: AnyMiddleware) => arg
      }

      if (middlewares.length === 1) {
        return middlewares[0]
      }

      return middlewares.reduce((acc, middleware) => {
        return (api: any) => acc(middleware(api))
      })
    })
  }

  const getMiddleware = (callback?: jest.Mock) => {
    return (api: any) => (next: AnyFn) => (action: string) => {
      callback?.(api, next, action)
      return next(action)
    }
  }

  test('Middlewares should be added to and removed from tray correctly', () => {
    const mid1 = getMiddleware()
    const mid2 = getMiddleware()

    const getCounter = buildCounterGetter()

    const tray = getMiddlewareTray(() => ({}))
    expect(getCounter().getItems()).toEqual([])

    tray.add([])
    expect(getCounter().getItems()).toEqual([])

    tray.remove([])
    expect(getCounter().getItems()).toEqual([])

    tray.add([mid1, mid2])
    expect(getCounter().getCount(mid1)).toEqual(1)
    expect(getCounter().getCount(mid2)).toEqual(1)

    tray.add([mid1, mid2])
    expect(getCounter().getCount(mid1)).toEqual(2)
    expect(getCounter().getCount(mid2)).toEqual(2)

    const fullTray: CounterItem<AnyMiddleware>[] = [
      { count: 2, value: mid1 },
      { count: 2, value: mid2 },
    ]

    tray.add([])
    expect(getCounter().getItems()).toEqual(fullTray)

    tray.remove([])
    expect(getCounter().getItems()).toEqual(fullTray)

    tray.remove([mid1, mid2])
    expect(getCounter().getCount(mid1)).toEqual(1)
    expect(getCounter().getCount(mid2)).toEqual(1)

    tray.remove([mid1, mid2])
    expect(getCounter().getCount(mid1)).toEqual(0)
    expect(getCounter().getCount(mid2)).toEqual(0)

    tray.remove([mid1, mid2])
    expect(getCounter().getItems()).toEqual([])

    tray.add([mid1, mid2, mid1, mid2])
    expect(getCounter().getCount(mid1)).toEqual(2)
    expect(getCounter().getCount(mid2)).toEqual(2)

    tray.remove([mid1, mid2, mid1, mid2])
    expect(getCounter().getItems()).toEqual([])
  })

  test('Added middlewares should be called with correct args', () => {
    const mid1 = jest.fn()
    const mid2 = jest.fn()

    const tray = getMiddlewareTray(() => ({}))

    const storeApi = {}

    tray.dynamicMiddleware(storeApi)

    tray.add([mid1, mid2])

    expect(mid1).toBeCalledTimes(1)
    expect(mid1).toBeCalledWith(storeApi)
    expect(mid2).toBeCalledTimes(1)
    expect(mid2).toBeCalledWith(storeApi)

    tray.add([mid1, mid2])
    expect(mid1).toBeCalledTimes(1)
    expect(mid2).toBeCalledTimes(1)

    tray.remove([mid1, mid2])
    expect(mid1).toBeCalledTimes(1)
    expect(mid2).toBeCalledTimes(1)
  })

  test('Middleware composer should be called', () => {
    const midReturnValue: ReturnType<AnyMiddleware> = jest.fn(() => () => undefined)
    const mid1: jest.Mock<AnyMiddleware> = jest.fn(() => midReturnValue)
    const mid2: jest.Mock<AnyMiddleware> = jest.fn(() => midReturnValue)

    const storeApi = {}
    const next = jest.fn()
    const action = { type: 'action' }

    const composeMiddleware = getMiddlewareComposer()

    const tray = getMiddlewareTray(composeMiddleware)

    expect(composeMiddleware).not.toBeCalled()

    tray.dynamicMiddleware({})(next)(action)
    expect(composeMiddleware).toBeCalledTimes(1)
    expect(composeMiddleware).nthCalledWith(1, ...[])

    tray.add([mid1])
    tray.dynamicMiddleware(storeApi)(next)(action)
    expect(composeMiddleware).toBeCalledTimes(2)
    expect(composeMiddleware).nthCalledWith(2, midReturnValue)

    tray.add([mid2])
    tray.dynamicMiddleware(storeApi)(next)(action)
    expect(composeMiddleware).toBeCalledTimes(3)
    expect(composeMiddleware).nthCalledWith(3, midReturnValue, midReturnValue)

    tray.dynamicMiddleware(storeApi)(next)(action)
    expect(composeMiddleware).toBeCalledTimes(4)
    expect(composeMiddleware).nthCalledWith(4, midReturnValue, midReturnValue)

    tray.remove([mid1, mid2])

    tray.dynamicMiddleware(storeApi)(next)(action)
    expect(composeMiddleware).toBeCalledTimes(5)
    expect(composeMiddleware).nthCalledWith(5, ...[])
  })
})
