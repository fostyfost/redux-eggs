import type { AnyAction, Middleware, Reducer } from 'redux'
import { applyMiddleware, compose, createStore } from 'redux'

import { getMiddlewareTray } from '@/middleware-tray'

describe('Tests for middleware tray', () => {
  const reducer: Reducer = (state = {}, action) => (action.type === 'foo' ? { foo: action.payload } : state)

  const getMiddleware = (callback?: ReturnType<typeof jest.fn>): Middleware => {
    return store => next => action => {
      callback?.(action, store)
      return next(action)
    }
  }

  const someAction = (payload = 'bar'): AnyAction => ({ type: 'foo', payload })

  const checkStore = () => {
    return expect.objectContaining({ dispatch: expect.any(Function), getState: expect.any(Function) })
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

  test('Redux should work', () => {
    const store = createStore(reducer, applyMiddleware(getMiddlewareTray(compose).mid))

    expect(store.getState()).toEqual({})

    store.dispatch(someAction())
    expect(store.getState()).toEqual({ foo: someAction().payload })
  })

  test('Middleware should be called', () => {
    const tray = getMiddlewareTray(compose)
    const store = createStore(reducer, applyMiddleware(tray.mid))

    const callback = jest.fn()
    tray.add([getMiddleware(callback)])
    store.dispatch(someAction())

    expect(callback).toBeCalledTimes(1)
    expect(callback).toBeCalledWith(someAction(), checkStore())
  })

  test('All middlewares by single add should be called', () => {
    const tray = getMiddlewareTray(compose)
    const store = createStore(reducer, applyMiddleware(tray.mid))

    const callback1 = jest.fn()
    const callback2 = jest.fn()
    tray.add([getMiddleware(callback1), getMiddleware(callback2)])
    store.dispatch(someAction())

    expect(callback1).toBeCalledTimes(1)
    expect(callback1).toBeCalledWith(someAction(), checkStore())

    expect(callback2).toBeCalledTimes(1)
    expect(callback2).toBeCalledWith(someAction(), checkStore())
  })

  test('All added middlewares should be called', () => {
    const tray = getMiddlewareTray(compose)
    const store = createStore(reducer, applyMiddleware(tray.mid))

    const callback1 = jest.fn()
    const callback2 = jest.fn()

    tray.add([getMiddleware(callback1)])
    tray.add([getMiddleware(callback2)])
    store.dispatch(someAction())
    expect(callback1).toBeCalledWith(someAction(), checkStore())
    expect(callback2).toBeCalledWith(someAction(), checkStore())
  })

  test('Removed middlewares should not be called', () => {
    const tray = getMiddlewareTray(compose)
    const store = createStore(reducer, applyMiddleware(tray.mid))

    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const mid1 = getMiddleware(callback1)
    const mid2 = getMiddleware(callback2)
    tray.add([mid1, mid2])
    tray.remove([mid2])
    store.dispatch(someAction())

    expect(callback1).toBeCalledTimes(1)
    expect(callback1).toBeCalledWith(someAction(), checkStore())
    expect(callback2).not.toBeCalled()
  })

  test('Multiple middleware trays should work correctly', () => {
    const tray1 = getMiddlewareTray(compose)
    const tray2 = getMiddlewareTray(compose)
    const tray3 = getMiddlewareTray(compose)

    const store1 = createStore(reducer, applyMiddleware(tray1.mid))
    const store2 = createStore(reducer, applyMiddleware(tray2.mid))
    const store3 = createStore(reducer, applyMiddleware(tray3.mid))

    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const callback3 = jest.fn()

    const clearMocks = () => [callback1, callback2, callback3].forEach(mock => mock.mockClear())

    const mid1 = getMiddleware(callback1)
    const mid2 = getMiddleware(callback2)
    const mid3 = getMiddleware(callback3)

    tray1.add([mid1])
    tray2.add([mid2])
    tray3.add([mid3])

    store1.dispatch(someAction('1'))
    expect(callback1).toBeCalledTimes(1)
    expect(callback1).toBeCalledWith(someAction('1'), checkStore())
    expect(callback2).not.toBeCalled()
    expect(callback3).not.toBeCalled()
    clearMocks()

    store2.dispatch(someAction('2'))
    expect(callback1).not.toBeCalled()
    expect(callback2).toBeCalledTimes(1)
    expect(callback2).toBeCalledWith(someAction('2'), checkStore())
    expect(callback3).not.toBeCalled()
    clearMocks()

    store3.dispatch(someAction('3'))
    expect(callback1).not.toBeCalled()
    expect(callback2).not.toBeCalled()
    expect(callback3).toBeCalledTimes(1)
    expect(callback3).toBeCalledWith(someAction('3'), checkStore())
    clearMocks()
  })

  test('Middleware tray counter should work correctly', () => {
    const tray = getMiddlewareTray(compose)

    const spyOnEnhancer = jest.spyOn(tray, 'mid')

    const reducer: Reducer = (state = {}, action) => {
      if (action.type.startsWith('type')) {
        return { ...state, foo: { ...state.foo, ...action.payload } }
      }
      return state
    }

    const store = createStore(reducer, applyMiddleware(tray.mid))

    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const callback3 = jest.fn()

    const clearMocks = () => [callback1, callback2, callback3].forEach(mock => mock.mockClear())

    const mid1: Middleware = store => {
      callback1()

      return next => action => {
        const nextAction = { ...action }

        if (nextAction.type === 'type1') {
          const foo = store.getState().foo
          nextAction.payload = typeof foo === 'object' ? { ...foo, test1: foo.test1 + 1 } : { test1: 1, test2: 2 }
        }

        return next(nextAction)
      }
    }

    const mid2: Middleware = store => {
      callback2()

      return next => action => {
        const nextAction = { ...action }

        if (nextAction.type === 'type2') {
          const foo = store.getState().foo
          nextAction.payload = typeof foo === 'object' ? { ...foo, test2: foo.test2 + 1 } : { test1: 1, test2: 2 }
        }

        return next(nextAction)
      }
    }

    const mid3: Middleware = store => {
      callback3()

      return next => action => {
        const nextAction = { ...action }

        if (nextAction.type === 'type3') {
          const foo = store.getState().foo
          nextAction.payload = typeof foo === 'object' ? { ...foo, test2: foo.test2 * 2 } : { test1: 1, test2: 2 }
        }

        return next(nextAction)
      }
    }

    tray.add([mid1, mid2]) // Counter: { mid1: 1, mid2: 1 }
    expect(store.getState()).toEqual({})
    expect(callback1).toBeCalledTimes(1)
    expect(callback2).toBeCalledTimes(1)
    expect(callback3).not.toBeCalled()
    clearMocks()

    store.dispatch({ type: 'type1' })
    expect(store.getState()).toEqual({ foo: { test1: 1, test2: 2 } })
    expect(callback1).not.toBeCalled()
    expect(callback2).not.toBeCalled()
    expect(callback3).not.toBeCalled()
    clearMocks()

    store.dispatch({ type: 'type2' })
    expect(store.getState()).toEqual({ foo: { test1: 1, test2: 3 } })
    expect(callback1).not.toBeCalled()
    expect(callback2).not.toBeCalled()
    expect(callback3).not.toBeCalled()
    clearMocks()

    store.dispatch({ type: 'type3' })
    expect(store.getState()).toEqual({ foo: { test1: 1, test2: 3 } })
    expect(callback1).not.toBeCalled()
    expect(callback2).not.toBeCalled()
    expect(callback3).not.toBeCalled()
    clearMocks()

    store.dispatch({ type: 'type1' })
    store.dispatch({ type: 'type2' })
    store.dispatch({ type: 'type3' })
    expect(store.getState()).toEqual({ foo: { test1: 2, test2: 4 } })
    expect(callback1).not.toBeCalled()
    expect(callback2).not.toBeCalled()
    expect(callback3).not.toBeCalled()
    clearMocks()

    tray.add([mid1, mid2]) // Counter: { mid1: 2, mid2: 2 }
    store.dispatch({ type: 'type1' })
    store.dispatch({ type: 'type2' })
    store.dispatch({ type: 'type3' })
    expect(store.getState()).toEqual({ foo: { test1: 3, test2: 5 } })
    expect(callback1).not.toBeCalled()
    expect(callback2).not.toBeCalled()
    expect(callback3).not.toBeCalled()
    clearMocks()

    tray.remove([mid1, mid2])
    store.dispatch({ type: 'type1' })
    store.dispatch({ type: 'type2' })
    store.dispatch({ type: 'type3' })
    expect(store.getState()).toEqual({ foo: { test1: 4, test2: 6 } })
    expect(callback1).not.toBeCalled()
    expect(callback2).not.toBeCalled()
    expect(callback3).not.toBeCalled()
    clearMocks()

    tray.remove([mid1, mid2]) // Counter: { mid1: 1, mid2: 1 }
    store.dispatch({ type: 'type1' })
    store.dispatch({ type: 'type2' })
    store.dispatch({ type: 'type3' })
    expect(store.getState()).toEqual({ foo: { test1: 4, test2: 6 } })
    expect(callback1).not.toBeCalled()
    expect(callback2).not.toBeCalled()
    expect(callback3).not.toBeCalled()
    clearMocks()

    tray.remove([mid1, mid2]) // Counter: {}
    store.dispatch({ type: 'type1' })
    store.dispatch({ type: 'type2' })
    store.dispatch({ type: 'type3' })
    expect(store.getState()).toEqual({ foo: { test1: 4, test2: 6 } })
    expect(callback1).not.toBeCalled()
    expect(callback2).not.toBeCalled()
    expect(callback3).not.toBeCalled()
    clearMocks()

    tray.add([mid1, mid3]) // Counter: { mid1: 1, mid3: 1 }
    expect(store.getState()).toEqual({ foo: { test1: 4, test2: 6 } })
    expect(callback1).toBeCalledTimes(1)
    expect(callback2).not.toBeCalled()
    expect(callback3).toBeCalledTimes(1)
    clearMocks()

    store.dispatch({ type: 'type1' })
    store.dispatch({ type: 'type2' })
    store.dispatch({ type: 'type3' })
    expect(store.getState()).toEqual({ foo: { test1: 5, test2: 12 } })
    expect(callback1).not.toBeCalled()
    expect(callback2).not.toBeCalled()
    expect(callback3).not.toBeCalled()
    clearMocks()

    tray.remove([mid1]) // Counter: { mid3: 1 }
    store.dispatch({ type: 'type1' })
    store.dispatch({ type: 'type2' })
    store.dispatch({ type: 'type3' })
    expect(store.getState()).toEqual({ foo: { test1: 5, test2: 24 } })
    expect(callback1).not.toBeCalled()
    expect(callback2).not.toBeCalled()
    expect(callback3).not.toBeCalled()
    clearMocks()

    expect(spyOnEnhancer).toBeCalledTimes(1)
  })
})
