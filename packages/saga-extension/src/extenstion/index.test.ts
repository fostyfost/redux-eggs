import type { Egg, Extension, RemoveAddedEggs } from '@redux-eggs/core'
import * as EggsForRedux from '@redux-eggs/redux'
import * as EggsForReduxToolkit from '@redux-eggs/redux-toolkit'
import * as ReduxToolkit from '@reduxjs/toolkit'
import type * as Redux from 'redux'
import { call, takeEvery } from 'redux-saga/effects'
import type { ThunkAction, ThunkMiddleware } from 'redux-thunk'
import thunk from 'redux-thunk'

import { getSagaExtension } from '@/extenstion'

describe('Saga extension tests', () => {
  function expectType<T>(value: T): void {
    expect(value).toEqual(value)
  }

  const getTaskName = (task: any): string => task.meta.name

  const getMocks = () => {
    let queue: string[] = []

    const getQueue = () => queue

    const resetQueue = () => {
      queue = []
    }

    const saga1 = function* saga1() {
      yield takeEvery('*', function* worker(action) {
        yield call(() => queue.push(`saga 1 ${action.type}`))
      })
    }

    const saga2 = function* saga2() {
      yield takeEvery('*', function* worker(action) {
        yield call(() => queue.push(`saga 2 ${action.type}`))
      })
    }

    const saga3 = function* saga3() {
      yield takeEvery('*', function* worker(action) {
        yield call(() => queue.push(`saga 3 ${action.type}`))
      })
    }

    return { getQueue, resetQueue, saga1, saga2, saga3 }
  }

  const thunkExtension: Extension<ThunkMiddleware> = { middleware: thunk }

  const asyncThunk = (): ThunkAction<Promise<string>, any, undefined, Redux.AnyAction> => {
    return () => Promise.resolve('thunk')
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

  describe('Tests with `@redux-eggs/redux`', () => {
    const anyReduxAction: () => Redux.Action<'any-type'> = () => ({ type: 'any-type' })

    test('Sagas should be added to and removed from store correctly', () => {
      const { getQueue, resetQueue, saga1, saga2, saga3 } = getMocks()

      const egg1: Egg = { id: '1', sagas: [saga1] }
      const egg2: Egg = { id: '2', sagas: [saga2, saga3] }

      const store = EggsForRedux.createStore({ extensions: [thunkExtension, getSagaExtension()] })

      const removers: RemoveAddedEggs[] = []

      removers.push(store.addEggs([egg1, egg2]))
      store.dispatch(anyReduxAction())
      expect(store.getSagaTasks().map(getTaskName)).toEqual(['saga1', 'saga2', 'saga3'])
      expect(getQueue()).toEqual(['saga 1 any-type', 'saga 2 any-type', 'saga 3 any-type'])
      resetQueue()

      removers.push(store.addEggs([egg1, egg2]))
      store.dispatch(anyReduxAction())
      expect(store.getSagaTasks().map(getTaskName)).toEqual(['saga1', 'saga2', 'saga3'])
      expect(getQueue()).toEqual(['saga 1 any-type', 'saga 2 any-type', 'saga 3 any-type'])
      resetQueue()

      removers.pop()?.()
      store.dispatch(anyReduxAction())
      expect(store.getSagaTasks().map(getTaskName)).toEqual(['saga1', 'saga2', 'saga3'])
      expect(getQueue()).toEqual(['saga 1 any-type', 'saga 2 any-type', 'saga 3 any-type'])
      resetQueue()

      removers.pop()?.()
      store.dispatch(anyReduxAction())
      expect(store.getSagaTasks()).toEqual([])
      expect(getQueue()).toEqual([])

      store.dispatch(asyncThunk()).then(result => expectType<string>(result))

      expect(removers.length).toBe(0)
    })
  })

  describe('Tests with `@redux-eggs/redux-toolkit`', () => {
    const anyToolkitAction = ReduxToolkit.createAction('any-type')

    test('Sagas should be added to and removed from store correctly', () => {
      const { getQueue, resetQueue, saga1, saga2, saga3 } = getMocks()

      const egg1: Egg = { id: '1', sagas: [saga1] }
      const egg2: Egg = { id: '2', sagas: [saga2, saga3] }

      const store = EggsForReduxToolkit.createStore({ extensions: [thunkExtension, getSagaExtension()] })

      const removers: RemoveAddedEggs[] = []

      removers.push(store.addEggs([egg1, egg2]))
      store.dispatch(anyToolkitAction())
      expect(store.getSagaTasks().map(getTaskName)).toEqual(['saga1', 'saga2', 'saga3'])
      expect(getQueue()).toEqual(['saga 1 any-type', 'saga 2 any-type', 'saga 3 any-type'])
      resetQueue()

      removers.push(store.addEggs([egg1, egg2]))
      store.dispatch(anyToolkitAction())
      expect(store.getSagaTasks().map(getTaskName)).toEqual(['saga1', 'saga2', 'saga3'])
      expect(getQueue()).toEqual(['saga 1 any-type', 'saga 2 any-type', 'saga 3 any-type'])
      resetQueue()

      removers.pop()?.()
      store.dispatch(anyToolkitAction())
      expect(store.getSagaTasks().map(getTaskName)).toEqual(['saga1', 'saga2', 'saga3'])
      expect(getQueue()).toEqual(['saga 1 any-type', 'saga 2 any-type', 'saga 3 any-type'])
      resetQueue()

      removers.pop()?.()
      store.dispatch(anyToolkitAction())
      expect(store.getSagaTasks()).toEqual([])
      expect(getQueue()).toEqual([])

      store.dispatch(asyncThunk()).then(result => expectType<string>(result))

      expect(removers.length).toBe(0)
    })
  })
})
