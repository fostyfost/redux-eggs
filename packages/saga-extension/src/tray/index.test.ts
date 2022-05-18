import type { AnyFn } from '@redux-eggs/core'
import type { Saga } from 'redux-saga'
import createSagaMiddleware from 'redux-saga'
import { call } from 'redux-saga/effects'

import { getSagaTray } from '@/tray'

describe('Tests for saga tray', () => {
  const noop: AnyFn = () => undefined

  const saga1: Saga = function* saga1() {
    yield call(noop)
  }

  const saga2: Saga = function* saga2() {
    yield call(noop)
  }

  const getTaskName = (task: any): string => task.meta.name

  test('Sagas should be added to and removed from tray correctly', () => {
    const middleware = createSagaMiddleware()
    middleware({ dispatch: noop, getState: noop })

    const tray = getSagaTray(middleware)

    tray.add([])
    expect(tray.getTasks()).toEqual([])

    tray.remove([])
    expect(tray.getTasks()).toEqual([])

    tray.add([saga1, saga2])
    expect(tray.getTasks().map(getTaskName)).toEqual(['saga1', 'saga2'])

    tray.add([saga1, saga2])
    expect(tray.getTasks().map(getTaskName)).toEqual(['saga1', 'saga2'])

    tray.add([])
    expect(tray.getTasks().map(getTaskName)).toEqual(['saga1', 'saga2'])

    tray.remove([])
    expect(tray.getTasks().map(getTaskName)).toEqual(['saga1', 'saga2'])

    tray.remove([saga1, saga2])
    expect(tray.getTasks().map(getTaskName)).toEqual(['saga1', 'saga2'])

    tray.remove([saga1, saga2])
    expect(tray.getTasks()).toEqual([])

    tray.remove([saga1, saga2])
    expect(tray.getTasks()).toEqual([])

    tray.add([saga1, saga2, saga1, saga2])
    expect(tray.getTasks().map(getTaskName)).toEqual(['saga1', 'saga2'])

    tray.remove([saga1, saga2])
    expect(tray.getTasks().map(getTaskName)).toEqual(['saga1', 'saga2'])

    tray.remove([saga1, saga2])
    expect(tray.getTasks()).toEqual([])
  })
})
