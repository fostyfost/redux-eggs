import type { Egg } from '@redux-eggs/core'
import { buildStore } from '@redux-eggs/core'
import type { Handler } from 'mitt'
import mitt from 'mitt'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import type { SagaIterator, Subscribe } from 'redux-saga'
import * as ReduxSaga from 'redux-saga'
import { call, fork, getContext, put, take, takeEvery } from 'redux-saga/effects'

import { getSagaExtension } from '@/extenstion'
import * as SagaTray from '@/tray'

const getSagasNames = (task: any): string => task.meta.name

describe('Saga extension tests', () => {
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

  test('Extension should contains added saga-middleware', () => {
    const middleware = ReduxSaga.default()

    const spyOnCreateSagaMiddleware = jest.spyOn(ReduxSaga, 'default')
    spyOnCreateSagaMiddleware.mockReturnValueOnce(middleware)

    const extension = getSagaExtension()

    const [sagaMiddleware] = extension.middlewares

    expect(extension.middlewares).toHaveLength(1)
    expect(sagaMiddleware).toBe(middleware)

    spyOnCreateSagaMiddleware.mockRestore()
  })

  test('Extension events should work', () => {
    const saga1 = function* saga1(): SagaIterator {
      yield call(() => void 0)
    }

    const saga2 = function* saga2(): SagaIterator {
      yield call(() => null)
    }

    const saga3 = function* saga3(): SagaIterator {
      yield call(() => null)
    }

    const saga4 = function* saga4(): SagaIterator {
      yield call(() => null)
    }

    const egg1: Egg = { id: 'egg1', sagas: [saga1] }
    const egg2: Egg = { id: 'egg2', sagas: [saga1, saga3, saga2] }
    const egg3: Egg = { id: 'egg3', sagas: [saga2, saga3] }
    const egg4: Egg = { id: 'egg4', sagas: [saga4, saga3] }
    const egg5: Egg = { id: 'egg5', sagas: [] }
    const egg6: Egg = { id: 'egg5' }

    const middleware = ReduxSaga.default()

    const taskCancelMock = jest.fn()

    const spyOnMiddlewareRun = jest.spyOn(middleware, 'run')
    spyOnMiddlewareRun.mockImplementation((fn): any => ({
      meta: { name: fn.name },
      cancel: taskCancelMock,
    }))

    const sagaTray = SagaTray.getSagaTray(middleware)

    const spyOnSagaTrayAdd = jest.spyOn(sagaTray, 'add')
    const spyOnSagaTrayRemove = jest.spyOn(sagaTray, 'remove')

    const spyOnSagaTray = jest.spyOn(SagaTray, 'getSagaTray')
    spyOnSagaTray.mockReturnValue(sagaTray)

    const clearMocks = () => {
      taskCancelMock.mockClear()
      spyOnMiddlewareRun.mockClear()
      spyOnSagaTrayAdd.mockClear()
      spyOnSagaTrayRemove.mockClear()
      spyOnSagaTray.mockClear()
    }

    expect(spyOnSagaTray).not.toBeCalled()

    const store = buildStore(
      (reducer, middlewareEnhancer, enhancersFromExtensions, middlewaresFromExtensions) => {
        return createStore(
          reducer,
          compose(...enhancersFromExtensions, applyMiddleware(...middlewaresFromExtensions, middlewareEnhancer)),
        )
      },
      combineReducers,
      compose,
      [getSagaExtension()],
    )

    expect(store.getSagaTasks().map(getSagasNames)).toEqual([])
    expect(taskCancelMock).not.toBeCalled()
    expect(spyOnMiddlewareRun).not.toBeCalled()
    expect(spyOnSagaTrayAdd).not.toBeCalled()
    expect(spyOnSagaTrayRemove).not.toBeCalled()
    expect(spyOnSagaTray).toBeCalledTimes(1)
    expect(spyOnSagaTray).toHaveReturnedWith(sagaTray)
    clearMocks()

    store.addEggs([egg1]) // Count: { saga1: 1 }
    expect(store.getSagaTasks().map(getSagasNames)).toEqual(['saga1'])
    expect(taskCancelMock).not.toBeCalled()
    expect(spyOnMiddlewareRun).toBeCalledTimes(1)
    expect(spyOnMiddlewareRun).toBeCalledWith(saga1)
    expect(spyOnSagaTrayAdd).toBeCalledTimes(1)
    expect(spyOnSagaTrayAdd).toBeCalledWith(egg1.sagas)
    expect(spyOnSagaTrayRemove).not.toBeCalled()
    expect(spyOnSagaTray).not.toBeCalled()
    clearMocks()

    store.addEggs([egg1]) // Count: { saga1: 2 }
    expect(store.getSagaTasks().map(getSagasNames)).toEqual(['saga1'])
    expect(taskCancelMock).not.toBeCalled()
    expect(spyOnMiddlewareRun).not.toBeCalled()
    expect(spyOnSagaTrayAdd).not.toBeCalled()
    expect(spyOnSagaTrayRemove).not.toBeCalled()
    expect(spyOnSagaTray).not.toBeCalled()
    clearMocks()

    store.addEggs([egg2]) // Count: { saga1: 3, saga2: 1, saga3: 1 }
    expect(store.getSagaTasks().map(getSagasNames)).toEqual(['saga1', 'saga3', 'saga2'])
    expect(taskCancelMock).not.toBeCalled()
    expect(spyOnMiddlewareRun).toBeCalledTimes(2)
    expect(spyOnMiddlewareRun).nthCalledWith(1, saga3)
    expect(spyOnMiddlewareRun).nthCalledWith(2, saga2)
    expect(spyOnSagaTrayAdd).toBeCalledTimes(1)
    expect(spyOnSagaTrayAdd).toBeCalledWith(egg2.sagas)
    expect(spyOnSagaTrayRemove).not.toBeCalled()
    expect(spyOnSagaTray).not.toBeCalled()
    clearMocks()

    store.addEggs([egg3]) // Count: { saga1: 3, saga2: 2, saga3: 2 }
    expect(store.getSagaTasks().map(getSagasNames)).toEqual(['saga1', 'saga3', 'saga2'])
    expect(taskCancelMock).not.toBeCalled()
    expect(spyOnMiddlewareRun).not.toBeCalled()
    expect(spyOnSagaTrayAdd).toBeCalledTimes(1)
    expect(spyOnSagaTrayAdd).toBeCalledWith(egg3.sagas)
    expect(spyOnSagaTrayRemove).not.toBeCalled()
    expect(spyOnSagaTray).not.toBeCalled()
    clearMocks()

    store.addEggs([egg4]) // Count: { saga1: 3, saga2: 2, saga3: 3, saga4: 1 }
    expect(store.getSagaTasks().map(getSagasNames)).toEqual(['saga1', 'saga3', 'saga2', 'saga4'])
    expect(taskCancelMock).not.toBeCalled()
    expect(spyOnMiddlewareRun).toBeCalledTimes(1)
    expect(spyOnMiddlewareRun).toBeCalledWith(saga4)
    expect(spyOnSagaTrayAdd).toBeCalledTimes(1)
    expect(spyOnSagaTrayAdd).toBeCalledWith(egg4.sagas)
    expect(spyOnSagaTrayRemove).not.toBeCalled()
    expect(spyOnSagaTray).not.toBeCalled()
    clearMocks()

    store.addEggs([egg4]) // Count: { saga1: 3, saga2: 2, saga3: 4, saga4: 2 }
    expect(store.getSagaTasks().map(getSagasNames)).toEqual(['saga1', 'saga3', 'saga2', 'saga4'])
    expect(taskCancelMock).not.toBeCalled()
    expect(spyOnMiddlewareRun).not.toBeCalled()
    expect(spyOnSagaTrayAdd).not.toBeCalled()
    expect(spyOnSagaTrayRemove).not.toBeCalled()
    expect(spyOnSagaTray).not.toBeCalled()
    clearMocks()

    store.addEggs([egg5]) // Count: { saga1: 3, saga2: 2, saga3: 4, saga4: 2 }
    expect(store.getSagaTasks().map(getSagasNames)).toEqual(['saga1', 'saga3', 'saga2', 'saga4'])
    expect(taskCancelMock).not.toBeCalled()
    expect(spyOnMiddlewareRun).not.toBeCalled()
    expect(spyOnSagaTrayAdd).toBeCalledTimes(1)
    expect(spyOnSagaTrayAdd).toBeCalledWith(egg5.sagas)
    expect(spyOnSagaTrayRemove).not.toBeCalled()
    expect(spyOnSagaTray).not.toBeCalled()
    clearMocks()

    store.addEggs([egg6]) // Count: { saga1: 3, saga2: 2, saga3: 4, saga4: 2 }
    expect(store.getSagaTasks().map(getSagasNames)).toEqual(['saga1', 'saga3', 'saga2', 'saga4'])
    expect(taskCancelMock).not.toBeCalled()
    expect(spyOnMiddlewareRun).not.toBeCalled()
    expect(spyOnSagaTrayAdd).not.toBeCalled()
    expect(spyOnSagaTrayRemove).not.toBeCalled()
    expect(spyOnSagaTray).not.toBeCalled()
    clearMocks()

    store.removeEggs([egg1]) // Count: { saga1: 2, saga2: 2, saga3: 4, saga4: 2 }
    expect(store.getSagaTasks().map(getSagasNames)).toEqual(['saga1', 'saga3', 'saga2', 'saga4'])
    expect(taskCancelMock).not.toBeCalled()
    expect(spyOnMiddlewareRun).not.toBeCalled()
    expect(spyOnSagaTrayAdd).not.toBeCalled()
    expect(spyOnSagaTrayRemove).not.toBeCalled()
    expect(spyOnSagaTray).not.toBeCalled()
    clearMocks()

    store.removeEggs([egg1]) // Count: { saga1: 1, saga2: 2, saga3: 4, saga4: 2 }
    expect(store.getSagaTasks().map(getSagasNames)).toEqual(['saga1', 'saga3', 'saga2', 'saga4'])
    expect(taskCancelMock).not.toBeCalled()
    expect(spyOnMiddlewareRun).not.toBeCalled()
    expect(spyOnSagaTrayAdd).not.toBeCalled()
    expect(spyOnSagaTrayRemove).toBeCalledTimes(1)
    expect(spyOnSagaTrayRemove).toBeCalledWith(egg1.sagas)
    expect(spyOnSagaTray).not.toBeCalled()
    clearMocks()

    store.removeEggs([egg2]) // Count: { saga2: 1, saga3: 3, saga4: 2 }
    expect(store.getSagaTasks().map(getSagasNames)).toEqual(['saga3', 'saga2', 'saga4'])
    expect(taskCancelMock).toBeCalledTimes(1)
    expect(spyOnMiddlewareRun).not.toBeCalled()
    expect(spyOnSagaTrayAdd).not.toBeCalled()
    expect(spyOnSagaTrayRemove).toBeCalledTimes(1)
    expect(spyOnSagaTrayRemove).toBeCalledWith(egg2.sagas)
    expect(spyOnSagaTray).not.toBeCalled()
    clearMocks()

    store.removeEggs([egg3]) // Count: { saga3: 2, saga4: 2 }
    expect(store.getSagaTasks().map(getSagasNames)).toEqual(['saga3', 'saga4'])
    expect(taskCancelMock).toBeCalledTimes(1)
    expect(spyOnMiddlewareRun).not.toBeCalled()
    expect(spyOnSagaTrayRemove).toBeCalledTimes(1)
    expect(spyOnSagaTrayRemove).toBeCalledWith(egg3.sagas)
    expect(spyOnSagaTray).not.toBeCalled()
    clearMocks()

    store.removeEggs([egg4]) // Count: { saga3: 1, saga4: 1 }
    expect(store.getSagaTasks().map(getSagasNames)).toEqual(['saga3', 'saga4'])
    expect(taskCancelMock).not.toBeCalled()
    expect(spyOnMiddlewareRun).not.toBeCalled()
    expect(spyOnSagaTrayAdd).not.toBeCalled()
    expect(spyOnSagaTrayRemove).not.toBeCalled()
    expect(spyOnSagaTray).not.toBeCalled()
    clearMocks()

    store.removeEggs([egg5]) // Count: { saga4: 1 }
    expect(store.getSagaTasks().map(getSagasNames)).toEqual(['saga3', 'saga4'])
    expect(taskCancelMock).not.toBeCalled()
    expect(spyOnMiddlewareRun).not.toBeCalled()
    expect(spyOnSagaTrayAdd).not.toBeCalled()
    expect(spyOnSagaTrayRemove).not.toBeCalled()
    expect(spyOnSagaTray).not.toBeCalled()
    clearMocks()

    store.removeEggs([egg6]) // Count: { saga4: 1 }
    expect(store.getSagaTasks().map(getSagasNames)).toEqual(['saga3', 'saga4'])
    expect(taskCancelMock).not.toBeCalled()
    expect(spyOnMiddlewareRun).not.toBeCalled()
    expect(spyOnSagaTrayAdd).not.toBeCalled()
    expect(spyOnSagaTrayRemove).toBeCalledTimes(1)
    expect(spyOnSagaTrayRemove).toBeCalledWith(egg5.sagas)
    expect(spyOnSagaTray).not.toBeCalled()
    clearMocks()

    store.removeEggs([egg4]) // Count: {}
    expect(store.getSagaTasks().map(getSagasNames)).toEqual([])
    expect(taskCancelMock).toBeCalledTimes(2)
    expect(spyOnMiddlewareRun).not.toBeCalled()
    expect(spyOnSagaTrayAdd).not.toBeCalled()
    expect(spyOnSagaTrayRemove).toBeCalledTimes(1)
    expect(spyOnSagaTrayRemove).toBeCalledWith(egg4.sagas)
    expect(spyOnSagaTray).not.toBeCalled()
    clearMocks()

    store.addEggs([egg1, egg2, egg3, egg4, egg5, egg6])
    expect(store.getSagaTasks().map(getSagasNames)).toEqual(['saga1', 'saga3', 'saga2', 'saga4'])
    expect(taskCancelMock).not.toBeCalled()
    expect(spyOnMiddlewareRun).toBeCalledTimes(4)
    expect(spyOnMiddlewareRun).nthCalledWith(1, saga1)
    expect(spyOnMiddlewareRun).nthCalledWith(2, saga3)
    expect(spyOnMiddlewareRun).nthCalledWith(3, saga2)
    expect(spyOnMiddlewareRun).nthCalledWith(4, saga4)
    expect(spyOnSagaTrayAdd).toBeCalledTimes(1)
    expect(spyOnSagaTrayAdd).toBeCalledWith([saga1, saga1, saga3, saga2, saga2, saga3, saga4, saga3])
    expect(spyOnSagaTrayRemove).not.toBeCalled()
    expect(spyOnSagaTray).not.toBeCalled()
    clearMocks()

    store.removeEggs([egg1, egg2, egg3, egg4, egg5, egg6])
    expect(store.getSagaTasks().map(getSagasNames)).toEqual([])
    expect(taskCancelMock).toBeCalledTimes(4)
    expect(spyOnMiddlewareRun).not.toBeCalled()
    expect(spyOnSagaTrayAdd).not.toBeCalled()
    expect(spyOnSagaTrayRemove).toBeCalledTimes(1)
    expect(spyOnSagaTrayRemove).toBeCalledWith([saga1, saga1, saga3, saga2, saga2, saga3, saga4, saga3])
    expect(spyOnSagaTray).not.toBeCalled()
    clearMocks()

    taskCancelMock.mockRestore()
    spyOnMiddlewareRun.mockRestore()
    spyOnSagaTrayAdd.mockRestore()
    spyOnSagaTrayRemove.mockRestore()
    spyOnSagaTray.mockRestore()
  })

  test('Sagas run in turn ...', async () => {
    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const callback3 = jest.fn()
    const callback4 = jest.fn()

    const saga1 = function* saga1(): SagaIterator {
      yield put({ type: 'ACTION-FROM-SAGA-1' })
      yield call(callback1)
    }

    const saga2 = function* saga2(): SagaIterator {
      yield takeEvery('ACTION-FROM-SAGA-1', function* worker() {
        yield put({ type: 'ACTION-FROM-SAGA-2' })
        yield call(callback2)
      })
    }

    const saga3 = function* saga3(): SagaIterator {
      yield takeEvery('ACTION-FROM-SAGA-2', function* worker() {
        yield put({ type: 'ACTION-FROM-SAGA-3' })
        yield call(callback3)
      })
    }

    const saga4 = function* saga4(): SagaIterator {
      yield takeEvery('ACTION-FROM-SAGA-3', function* worker() {
        yield call(callback4)
      })
    }

    const egg1: Egg = { id: 'egg1', sagas: [saga1, saga2] }
    const egg2: Egg = { id: 'egg2', sagas: [saga3, saga4] }

    const store = buildStore(
      (reducer, middlewareEnhancer, enhancersFromExtensions, middlewaresFromExtensions) => {
        return createStore(
          reducer,
          compose(...enhancersFromExtensions, applyMiddleware(...middlewaresFromExtensions, middlewareEnhancer)),
        )
      },
      combineReducers,
      compose,
      [getSagaExtension()],
    )

    const removeEggs = store.addEggs([egg1, egg2])

    expect(callback1).toBeCalledTimes(1)
    expect(callback2).not.toBeCalled()
    expect(callback3).not.toBeCalled()
    expect(callback4).not.toBeCalled()
    expect(store.getSagaTasks().map(getSagasNames)).toEqual(['saga1', 'saga2', 'saga3', 'saga4'])

    removeEggs()
    expect(store.getSagaTasks().map(getSagasNames)).toEqual([])
  })

  test('... but we can work around this limitation', () => {
    const eventEmitter = mitt<{ started: string }>()

    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const callback3 = jest.fn()
    const callback4 = jest.fn()

    function* emit(name: string) {
      ;((yield getContext('sagas')) as string[]).push(name)
      eventEmitter.emit('started', name)
    }

    const waitSaga = function* waitSaga(name: string): SagaIterator {
      const context: string[] = yield getContext('sagas')

      if (context.includes(name)) {
        return
      }

      const subscribe: Subscribe<string> = emitter => {
        const handler: Handler<string> = payload => {
          if (payload === name) {
            emitter(payload)
          }
        }

        eventEmitter.on<'started'>('started', handler)

        // Unsubscribe
        return (): void => {
          eventEmitter.off<'started'>('started', handler)
        }
      }

      const channel = ReduxSaga.eventChannel(subscribe)
      yield take(channel)
      channel.close()
    }

    const saga1 = function* saga1(): SagaIterator {
      yield call(waitSaga, 'saga2')

      yield put({ type: 'ACTION-FROM-SAGA-1' })
      yield call(callback1)

      yield fork(emit, 'saga1')
    }

    const saga2 = function* saga2(): SagaIterator {
      yield call(waitSaga, 'saga3')

      yield takeEvery('ACTION-FROM-SAGA-1', function* worker() {
        yield put({ type: 'ACTION-FROM-SAGA-2' })
        yield call(callback2)
      })

      yield fork(emit, 'saga2')
    }

    const saga3 = function* saga3(): SagaIterator {
      yield call(waitSaga, 'saga4')

      yield takeEvery('ACTION-FROM-SAGA-2', function* worker() {
        yield put({ type: 'ACTION-FROM-SAGA-3' })
        yield call(callback3)
      })

      yield fork(emit, 'saga3')
    }

    const saga4 = function* saga4(): SagaIterator {
      yield takeEvery('ACTION-FROM-SAGA-3', function* worker() {
        yield call(callback4)
      })

      yield fork(emit, 'saga4')
    }

    const egg1: Egg = { id: 'egg1', sagas: [saga1, saga2] }
    const egg2: Egg = { id: 'egg2', sagas: [saga3, saga4] }

    const store = buildStore(
      (reducer, middlewareEnhancer, enhancersFromExtensions, middlewaresFromExtensions) => {
        return createStore(
          reducer,
          compose(...enhancersFromExtensions, applyMiddleware(...middlewaresFromExtensions, middlewareEnhancer)),
        )
      },
      combineReducers,
      compose,
      [getSagaExtension({ context: { sagas: [] } })],
    )

    const removeEggs = store.addEggs([egg1, egg2])

    expect(callback1).toBeCalledTimes(1)
    expect(callback2).toBeCalledTimes(1)
    expect(callback3).toBeCalledTimes(1)
    expect(callback4).toBeCalledTimes(1)
    expect(store.getSagaTasks().map(getSagasNames)).toEqual(['saga1', 'saga2', 'saga3', 'saga4'])

    removeEggs()
    expect(store.getSagaTasks().map(getSagasNames)).toEqual([])
  })
})
