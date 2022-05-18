import type { AnyFn, Egg, Extension, RemoveAddedEggs } from '@redux-eggs/core'
import type { Dispatch, Middleware, ReducersMapObject, StoreEnhancer } from '@reduxjs/toolkit'
import { combineReducers, createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { ThunkMiddlewareFor } from '@reduxjs/toolkit/dist/getDefaultMiddleware'

import type { ExtensionEventHandler } from '@/contracts'
import { createStore } from '@/create-store'

describe('Tests for `createStore` with Redux', () => {
  const counterSlice = createSlice({
    name: 'counter',
    initialState: 0,
    reducers: {
      increment(state) {
        return state + 1
      },
    },
  })

  const counterEgg: Egg = { id: 'counter-egg', reducersMap: { [counterSlice.name]: counterSlice.reducer } }

  const incrementAsync = createAsyncThunk<
    { counterBefore: number; counterAfter: number },
    void,
    { state: { counter: number } }
  >('counter/increment-async', async (_, thunkApi) => {
    const { counter: counterBefore } = thunkApi.getState()
    thunkApi.dispatch(counterSlice.actions.increment())
    const { counter: counterAfter } = thunkApi.getState()
    return Promise.resolve({ counterBefore, counterAfter })
  })

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
    const slice1 = createSlice({
      name: 'slice1',
      initialState: {},
      reducers: {},
    })

    const slice2 = createSlice({
      name: 'slice2',
      initialState: {},
      reducers: {},
    })

    const egg1: Egg = { id: 'egg1', reducersMap: { [slice1.name]: slice1.reducer } }
    const egg2: Egg = { id: 'egg2', reducersMap: { [slice2.name]: slice2.reducer } }
    const egg3: Egg = { id: 'egg3', reducersMap: { [slice1.name]: slice1.reducer, [slice2.name]: slice2.reducer } }

    const store = createStore()

    const removers: RemoveAddedEggs[] = []

    removers.push(store.addEggs([]))
    expect(store.getState()).toEqual({})

    removers.pop()?.()
    expect(store.getState()).toEqual({})

    removers.push(store.addEggs(egg1, egg2))
    expect(store.getState()).toEqual({ [slice1.name]: {}, [slice2.name]: {} })

    removers.push(store.addEggs(egg1, egg2))
    expect(store.getState()).toEqual({ [slice1.name]: {}, [slice2.name]: {} })

    removers.push(store.addEggs(egg3))
    expect(store.getState()).toEqual({ [slice1.name]: {}, [slice2.name]: {} })

    removers.pop()?.()
    expect(store.getState()).toEqual({ [slice1.name]: {}, [slice2.name]: {} })

    removers.pop()?.()
    expect(store.getState()).toEqual({ [slice1.name]: {}, [slice2.name]: {} })

    removers.pop()?.()
    expect(store.getState()).toEqual({})
    expect(store.getEggs()).toEqual([])

    expect(removers.length).toBe(0)
  })

  test('Store is initialized with custom `reducerCombiner`', () => {
    const reducerCombiner = jest.fn((reducers: ReducersMapObject) => {
      return combineReducers(reducers)
    })

    const slice1 = createSlice({
      name: 'slice1',
      initialState: {},
      reducers: {},
    })

    const slice2 = createSlice({
      name: 'slice2',
      initialState: {},
      reducers: {},
    })

    const slice3 = createSlice({
      name: 'slice3',
      initialState: {},
      reducers: {},
    })

    const egg1: Egg = { id: 'egg1', reducersMap: { [slice1.name]: slice1.reducer } }
    const egg2: Egg = { id: 'egg2', reducersMap: { [slice2.name]: slice2.reducer } }
    const egg3: Egg = { id: 'egg3', reducersMap: { [slice1.name]: slice1.reducer, [slice2.name]: slice2.reducer } }
    const egg4: Egg = { id: 'egg4', reducersMap: { [slice3.name]: slice3.reducer } }

    const store = createStore({ reducerCombiner })

    const removers: RemoveAddedEggs[] = []

    removers.push(store.addEggs([]))
    removers.pop()?.()
    expect(reducerCombiner).not.toBeCalled()

    removers.push(store.addEggs(egg1, egg2))
    expect(reducerCombiner).toBeCalledTimes(1)
    expect(reducerCombiner).nthCalledWith(1, { [slice1.name]: slice1.reducer, [slice2.name]: slice2.reducer })

    removers.push(store.addEggs(egg1, egg2))
    expect(reducerCombiner).toBeCalledTimes(1)

    removers.push(store.addEggs(egg3))
    expect(reducerCombiner).toBeCalledTimes(1)

    removers.push(store.addEggs(egg4))
    expect(reducerCombiner).toBeCalledTimes(2)
    expect(reducerCombiner).nthCalledWith(2, {
      [slice1.name]: slice1.reducer,
      [slice2.name]: slice2.reducer,
      [slice3.name]: slice3.reducer,
    })

    removers.pop()?.()
    expect(reducerCombiner).toBeCalledTimes(3)
    expect(reducerCombiner).nthCalledWith(3, { [slice1.name]: slice1.reducer, [slice2.name]: slice2.reducer })

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

    const anyAction = createAction('any-type')

    const removers: RemoveAddedEggs[] = []

    removers.push(store.addEggs(egg1, egg2))
    store.dispatch(anyAction())
    expect(queue).toEqual(['mid1'])
    store.dispatch(anyAction())
    expect(queue).toEqual(['mid1', 'mid1'])
    queue = []

    removers.push(store.addEggs(egg1, egg2))
    removers.push(store.addEggs(egg3))
    store.dispatch(anyAction())
    expect(queue).toEqual(['mid1', 'mid2', 'mid3'])
    queue = []

    removers.pop()?.()
    store.dispatch(anyAction())
    expect(queue).toEqual(['mid1'])
    queue = []

    removers.pop()?.()
    store.dispatch(anyAction())
    expect(queue).toEqual(['mid1'])
    queue = []

    removers.pop()?.()
    store.dispatch(anyAction())
    expect(queue).toEqual([])

    expect(removers.length).toBe(0)
  })

  test('Middlewares from extensions should work', () => {
    const slice1 = createSlice({
      name: 'slice1',
      initialState: {},
      reducers: {},
    })

    const slice2 = createSlice({
      name: 'slice2',
      initialState: {},
      reducers: {},
    })

    const slice3 = createSlice({
      name: 'slice3',
      initialState: {},
      reducers: {},
    })

    const egg1: Egg = { id: 'egg1', reducersMap: { [slice1.name]: slice1.reducer } }
    const egg2: Egg = { id: 'egg2', reducersMap: { [slice2.name]: slice2.reducer } }
    const egg3: Egg = { id: 'egg3', reducersMap: { [slice3.name]: slice3.reducer } }

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
      payload: { method: 'add', reducers: [slice1.name, slice2.name] },
    })
    queue = []

    removers.push(store.addEggs(egg1, egg2))
    removers.push(store.addEggs(egg3))
    expect(queue).toEqual(['mid1', 'mid2', 'mid3'])
    expect(actionChecker).toBeCalledTimes(2)
    expect(actionChecker).nthCalledWith(2, {
      type: '@@eggs/reduce',
      payload: { method: 'add', reducers: [slice3.name] },
    })
    queue = []

    removers.pop()?.()
    expect(queue).toEqual(['mid1', 'mid2', 'mid3'])
    expect(actionChecker).toBeCalledTimes(3)
    expect(actionChecker).nthCalledWith(3, {
      type: '@@eggs/reduce',
      payload: { method: 'remove', reducers: [slice3.name] },
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
      payload: { method: 'remove', reducers: [slice2.name, slice1.name] },
    })

    expect(removers.length).toBe(0)
  })

  test('Middleware should enhance `dispatch`', async () => {
    {
      const store = createStore()

      store.addEggs(counterEgg)

      {
        const { counterBefore, counterAfter } = await store.dispatch(incrementAsync()).unwrap()
        expect(counterBefore).toBe(0)
        expect(counterAfter).toBe(1)
      }

      {
        const { counterBefore, counterAfter } = await store.dispatch(incrementAsync()).unwrap()
        expect(counterBefore).toBe(1)
        expect(counterAfter).toBe(2)
      }
    }

    {
      const store = createStore({ middleware: [] })

      // @ts-expect-error
      expect(() => store.dispatch(incrementAsync())).toThrow()
    }

    {
      const store = createStore({
        middleware: getDefaultMiddleware => {
          return getDefaultMiddleware({ thunk: false })
        },
      })

      // @ts-expect-error
      expect(() => store.dispatch(incrementAsync())).toThrow()
    }

    {
      const store = createStore({
        middleware() {
          return []
        },
      })

      // @ts-expect-error
      expect(() => store.dispatch(incrementAsync())).toThrow()
    }

    {
      const queue: string[] = []

      type CallbackAction1 = AnyFn & { callback1: AnyFn }
      interface Dispatch1 extends Dispatch<any> {
        (action: CallbackAction1): any
      }
      type CallbackMiddleware1 = Middleware<Dispatch1, any, Dispatch1>

      type CallbackAction2 = AnyFn & { callback2: AnyFn }
      interface Dispatch2 extends Dispatch<any> {
        (action: CallbackAction2): any
      }
      type CallbackMiddleware2 = Middleware<Dispatch2, any, Dispatch2>

      const mid1: CallbackMiddleware1 = () => {
        return next => action => {
          if (typeof action === 'function' && action.callback1) {
            queue.push('middleware 1')
            action()
            action.callback1()
            return
          }

          return next(action)
        }
      }

      const mid2: CallbackMiddleware2 = () => {
        return next => action => {
          if (typeof action === 'function' && action.callback2) {
            queue.push('middleware 2')
            action()
            action.callback2()
            return
          }

          return next(action)
        }
      }

      const store = createStore({
        middleware(getDefaultMiddleware) {
          return getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(mid1)
        },
        extensions: [{ middleware: mid2 }],
      })

      store.dispatch(createAction('any-type')())
      expect(queue).toEqual([])

      const action1 = () => queue.push('action 1')
      action1.callback1 = () => queue.push('callback 1')
      store.dispatch(action1)

      const action2 = () => queue.push('action 2')
      action2.callback2 = () => queue.push('callback 2')
      store.dispatch(action2)

      expect(queue).toEqual(['middleware 1', 'action 1', 'callback 1', 'middleware 2', 'action 2', 'callback 2'])
    }
  })

  test('Enhancers from extensions should work', async () => {
    const egg1: Egg = { id: 'egg1' }
    const egg2: Egg = { id: 'egg2' }

    const trackAdd = jest.fn()
    const trackRemove = jest.fn()
    const spyOnAsyncIncrement = jest.fn()

    const trackAddEggs: Extension<
      ThunkMiddlewareFor<any>,
      StoreEnhancer<{ trackAdd: (...args: any[]) => void }>,
      ExtensionEventHandler<ThunkMiddlewareFor<any>, StoreEnhancer<{ trackAdd: (...args: any[]) => void }>>
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
      ThunkMiddlewareFor<any>,
      StoreEnhancer<{ trackRemove: (...args: any[]) => void }>,
      ExtensionEventHandler<ThunkMiddlewareFor<any>, StoreEnhancer<{ trackRemove: (...args: any[]) => void }>>
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

    const store = createStore({ extensions: [trackAddEggs, trackRemoveEggs] })

    expect(trackAdd).not.toBeCalled()
    expect(trackRemove).not.toBeCalled()
    expect(spyOnAsyncIncrement).not.toBeCalled()

    store.addEggs(counterEgg)
    expect(trackAdd).toBeCalledTimes(1)
    expect(trackAdd).nthCalledWith(1, [counterEgg], store)
    expect(trackRemove).not.toBeCalled()
    await new Promise(process.nextTick)
    expect(spyOnAsyncIncrement).toBeCalledTimes(1)
    expect(spyOnAsyncIncrement).nthCalledWith(
      1,
      expect.objectContaining({ payload: { counterBefore: 0, counterAfter: 1 } }),
    )

    const removers: RemoveAddedEggs[] = []

    removers.push(store.addEggs(egg1))
    expect(trackAdd).toBeCalledTimes(2)
    expect(trackAdd).nthCalledWith(2, [egg1], store)
    expect(trackRemove).not.toBeCalled()
    await new Promise(process.nextTick)
    expect(spyOnAsyncIncrement).toBeCalledTimes(2)
    expect(spyOnAsyncIncrement).nthCalledWith(
      2,
      expect.objectContaining({ payload: { counterBefore: 1, counterAfter: 2 } }),
    )

    removers.push(store.addEggs(egg2))

    expect(trackAdd).toBeCalledTimes(3)
    expect(trackAdd).nthCalledWith(3, [egg2], store)
    expect(trackRemove).not.toBeCalled()
    await new Promise(process.nextTick)
    expect(spyOnAsyncIncrement).toBeCalledTimes(3)
    expect(spyOnAsyncIncrement).nthCalledWith(
      3,
      expect.objectContaining({ payload: { counterBefore: 2, counterAfter: 3 } }),
    )

    removers.pop()?.()
    expect(trackAdd).toBeCalledTimes(3)
    expect(trackRemove).toBeCalledTimes(1)
    expect(trackRemove).nthCalledWith(1, [egg2], store)
    await new Promise(process.nextTick)
    expect(spyOnAsyncIncrement).toBeCalledTimes(4)
    expect(spyOnAsyncIncrement).nthCalledWith(
      4,
      expect.objectContaining({ payload: { counterBefore: 3, counterAfter: 4 } }),
    )

    removers.pop()?.()
    expect(trackAdd).toBeCalledTimes(3)
    expect(trackRemove).toBeCalledTimes(2)
    expect(trackRemove).nthCalledWith(2, [egg1], store)
    await new Promise(process.nextTick)
    expect(spyOnAsyncIncrement).toBeCalledTimes(5)
    expect(spyOnAsyncIncrement).nthCalledWith(
      5,
      expect.objectContaining({ payload: { counterBefore: 4, counterAfter: 5 } }),
    )

    expect(removers.length).toBe(0)

    store.trackAdd()
    expect(trackAdd).toBeCalledTimes(4)

    store.trackRemove()
    expect(trackRemove).toBeCalledTimes(3)

    store.dispatch(incrementAsync()).then(result => spyOnAsyncIncrement(result))
    await new Promise(process.nextTick)
    expect(spyOnAsyncIncrement).toBeCalledTimes(6)
    expect(spyOnAsyncIncrement).nthCalledWith(
      6,
      expect.objectContaining({ payload: { counterBefore: 5, counterAfter: 6 } }),
    )
  })
})
