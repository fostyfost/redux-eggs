import type { AnyAction, Reducer } from 'redux'
import { applyMiddleware, createStore } from 'redux'
import type { Saga } from 'redux-saga'
import createSagaMiddleware from 'redux-saga'
import { call, put, takeEvery } from 'redux-saga/effects'

import { getSagaTray } from '@/tray'

describe('Tests for saga tray', () => {
  const reducer: Reducer = (state = {}, action) => (action.type === 'foo' ? { foo: action.payload } : state)

  const someAction = (payload = 'bar'): AnyAction => ({ type: 'foo', payload })

  const getSaga = (callback: (...args: any[]) => void, ...args: any[]): Saga => {
    return function* saga() {
      yield call(callback, ...args)
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

  test('Sagas runs once per addition', async () => {
    const sagaMiddleware = createSagaMiddleware()
    const tray = getSagaTray(sagaMiddleware)

    createStore(reducer, applyMiddleware(sagaMiddleware))

    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const callback3 = jest.fn()
    const callback4 = jest.fn()

    const clearMocks = () => {
      callback1.mockClear()
      callback2.mockClear()
      callback3.mockClear()
      callback4.mockClear()
    }

    const saga1 = getSaga(callback1)
    const saga2 = getSaga(callback2)
    const saga3 = getSaga(callback3)
    const saga4 = getSaga(callback4)

    expect(callback1).not.toBeCalled()
    expect(callback2).not.toBeCalled()
    expect(callback3).not.toBeCalled()
    expect(callback4).not.toBeCalled()

    tray.add([saga1, saga2])
    expect(callback1).toBeCalledTimes(1)
    expect(callback2).toBeCalledTimes(1)
    expect(callback3).not.toBeCalled()
    expect(callback4).not.toBeCalled()
    clearMocks()

    tray.add([saga3])
    tray.add([saga4])
    expect(callback1).not.toBeCalled()
    expect(callback2).not.toBeCalled()
    expect(callback3).toBeCalledTimes(1)
    expect(callback4).toBeCalledTimes(1)
    clearMocks()

    tray.add([saga1])
    tray.add([saga2])
    tray.add([saga3])
    tray.add([saga4])
    expect(callback1).not.toBeCalled()
    expect(callback2).not.toBeCalled()
    expect(callback3).not.toBeCalled()
    expect(callback4).not.toBeCalled()

    tray.add([saga1, saga2, saga3, saga4])
    expect(callback1).not.toBeCalled()
    expect(callback2).not.toBeCalled()
    expect(callback3).not.toBeCalled()
    expect(callback4).not.toBeCalled()
  })

  test('Tasks are run and are cancelled correctly', () => {
    const testAction = (payload: string): AnyAction => ({ type: 'TEST', payload })

    const sagaMiddleware = createSagaMiddleware()
    const tray = getSagaTray(sagaMiddleware)

    const store = createStore(reducer, applyMiddleware(sagaMiddleware))

    const beforePut = jest.fn()
    const callback = jest.fn()
    callback.mockImplementation(function* () {
      yield takeEvery('TEST', function* (action: AnyAction) {
        yield call(beforePut, action.payload)
        yield put(someAction(action.payload))
      })
    })

    const saga = getSaga(callback)

    expect(callback).not.toBeCalled()

    tray.add([saga]) // Count: { saga: 1 }
    expect(callback).toBeCalledTimes(1)
    expect(beforePut).not.toBeCalled()
    expect(store.getState()).toEqual({})
    callback.mockClear()

    store.dispatch(testAction('test-value-1'))
    expect(callback).not.toBeCalled()
    expect(beforePut).toBeCalledTimes(1)
    expect(beforePut).toBeCalledWith('test-value-1')
    expect(store.getState()).toEqual({ foo: 'test-value-1' })
    beforePut.mockClear()

    store.dispatch(testAction('test-value-2'))
    expect(callback).not.toBeCalled()
    expect(beforePut).toBeCalledTimes(1)
    expect(beforePut).toBeCalledWith('test-value-2')
    expect(store.getState()).toEqual({ foo: 'test-value-2' })
    beforePut.mockClear()

    tray.add([saga]) // Count: { saga: 2 }
    expect(callback).not.toBeCalled()
    expect(beforePut).not.toBeCalled()
    expect(store.getState()).toEqual({ foo: 'test-value-2' })
    store.dispatch(testAction('test-value-3'))
    expect(callback).not.toBeCalled()
    expect(beforePut).toBeCalledTimes(1)
    expect(beforePut).toBeCalledWith('test-value-3')
    expect(store.getState()).toEqual({ foo: 'test-value-3' })
    beforePut.mockClear()

    tray.remove([saga]) // Count: { saga: 1 }
    expect(callback).not.toBeCalled()
    expect(beforePut).not.toBeCalled()
    expect(store.getState()).toEqual({ foo: 'test-value-3' })
    store.dispatch(testAction('test-value-4'))
    expect(callback).not.toBeCalled()
    expect(beforePut).toBeCalledTimes(1)
    expect(beforePut).toBeCalledWith('test-value-4')
    expect(store.getState()).toEqual({ foo: 'test-value-4' })
    beforePut.mockClear()

    tray.remove([saga]) // Count: {}
    expect(callback).not.toBeCalled()
    expect(beforePut).not.toBeCalled()
    expect(store.getState()).toEqual({ foo: 'test-value-4' })
    store.dispatch(testAction('test-value-4'))
    expect(callback).not.toBeCalled()
    expect(beforePut).not.toBeCalled()
    expect(store.getState()).toEqual({ foo: 'test-value-4' })
  })

  test('Saga tray contains correct tasks', () => {
    const sagaMiddleware = createSagaMiddleware()
    const tray = getSagaTray(sagaMiddleware)

    createStore(reducer, applyMiddleware(sagaMiddleware))

    const saga1 = function* saga1() {
      yield call(() => void 0)
    }

    const saga2 = function* saga2() {
      yield call(() => null)
    }

    const saga3 = function* saga3() {
      yield call(() => null)
    }

    const saga4 = function* saga4() {
      yield call(() => null)
    }

    const getSagasNames = (task: any): string => task.meta.name

    // Count: {}
    expect(tray.getTasks()).toHaveLength(0)
    expect(tray.getTasks().map(getSagasNames)).toEqual([])

    tray.add([saga3])
    // Count: { saga3: 1 }
    expect(tray.getTasks()).toHaveLength(1)
    expect(tray.getTasks().map(getSagasNames)).toEqual(['saga3'])

    tray.add([saga1, saga2])
    // Count: { saga1: 1, saga2: 1, saga3: 1 }
    expect(tray.getTasks()).toHaveLength(3)
    expect(tray.getTasks().map(getSagasNames)).toEqual(['saga3', 'saga1', 'saga2'])

    tray.add([saga4])
    // Count: { saga1: 1, saga2: 1, saga3: 1, saga4: 1 }
    expect(tray.getTasks()).toHaveLength(4)
    expect(tray.getTasks().map(getSagasNames)).toEqual(['saga3', 'saga1', 'saga2', 'saga4'])

    tray.add([saga1])
    tray.add([saga2])
    tray.add([saga3])
    tray.add([saga4])
    // Count: { saga1: 2, saga2: 2, saga3: 2, saga4: 2 }
    expect(tray.getTasks()).toHaveLength(4)
    expect(tray.getTasks().map(getSagasNames)).toEqual(['saga3', 'saga1', 'saga2', 'saga4'])

    tray.add([saga1, saga2, saga3, saga4])
    // Count: { saga1: 3, saga2: 3, saga3: 3, saga4: 3 }
    expect(tray.getTasks()).toHaveLength(4)
    expect(tray.getTasks().map(getSagasNames)).toEqual(['saga3', 'saga1', 'saga2', 'saga4'])

    tray.remove([saga1, saga2])
    // Count: { saga1: 2, saga2: 2, saga3: 3, saga4: 3 }
    expect(tray.getTasks()).toHaveLength(4)
    expect(tray.getTasks().map(getSagasNames)).toEqual(['saga3', 'saga1', 'saga2', 'saga4'])

    tray.remove([saga1, saga1])
    // Count: { saga2: 2, saga3: 3, saga4: 3 }
    expect(tray.getTasks()).toHaveLength(3)
    expect(tray.getTasks().map(getSagasNames)).toEqual(['saga3', 'saga2', 'saga4'])

    tray.remove([saga2, saga2, saga3, saga2, saga2, saga3, saga3, saga3, saga3, saga4])
    // Count: { saga4: 2 }
    expect(tray.getTasks()).toHaveLength(1)
    expect(tray.getTasks().map(getSagasNames)).toEqual(['saga4'])

    tray.remove([saga4])
    // Count: { saga4: 1 }
    expect(tray.getTasks()).toHaveLength(1)
    expect(tray.getTasks().map(getSagasNames)).toEqual(['saga4'])

    tray.remove([saga4])
    // Count: {}
    expect(tray.getTasks()).toHaveLength(0)
    expect(tray.getTasks().map(getSagasNames)).toEqual([])
  })
})
