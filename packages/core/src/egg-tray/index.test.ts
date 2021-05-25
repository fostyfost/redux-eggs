import type { Middleware, Reducer } from 'redux'

import type { Egg } from '@/contracts'
import { getEggTray } from '@/egg-tray'

const middleware1: Middleware = () => next => action => next(action)
const middleware2: Middleware = () => next => action => next(action)
const middleware3: Middleware = () => next => action => next(action)

const reducer1: Reducer = () => ({ value: 1 })
const reducer2: Reducer = () => ({ value: 2 })
const reducer3: Reducer = () => ({ value: 3 })

describe('Tests for eggs tray', () => {
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
    const tray = getEggTray()

    expect(tray.getItems()).toEqual([])

    const egg1: Egg = {
      id: 'egg1',
      reducerMap: { ['test-1-1']: reducer1, ['test-1-2']: reducer2 },
      middlewares: [middleware1, middleware2],
    }

    const egg2: Egg = {
      id: 'egg2',
      reducerMap: { ['test-2']: reducer3 },
    }

    const egg3: Egg = {
      id: 'egg3',
      middlewares: [middleware3],
    }

    tray.add([egg1])
    expect(tray.getItems()).toEqual([{ value: egg1, count: 1 }])

    tray.add([egg1])
    expect(tray.getItems()).toEqual([{ value: egg1, count: 2 }])

    tray.remove([egg1])
    expect(tray.getItems()).toEqual([{ value: egg1, count: 1 }])

    tray.remove([egg1])
    expect(tray.getItems()).toEqual([])

    tray.remove([egg1])
    expect(tray.getItems()).toEqual([])

    tray.add([egg1, egg2])
    expect(tray.getItems()).toEqual([
      { value: egg1, count: 1 },
      { value: egg2, count: 1 },
    ])

    tray.add([egg3])
    expect(tray.getItems()).toEqual([
      { value: egg1, count: 1 },
      { value: egg2, count: 1 },
      { value: egg3, count: 1 },
    ])

    tray.add([egg3])
    expect(tray.getItems()).toEqual([
      { value: egg1, count: 1 },
      { value: egg2, count: 1 },
      { value: egg3, count: 2 },
    ])

    tray.remove([egg3])
    expect(tray.getItems()).toEqual([
      { value: egg1, count: 1 },
      { value: egg2, count: 1 },
      { value: egg3, count: 1 },
    ])

    tray.remove([egg2])
    expect(tray.getItems()).toEqual([
      { value: egg1, count: 1 },
      { value: egg3, count: 1 },
    ])

    tray.remove([egg2])
    expect(tray.getItems()).toEqual([
      { value: egg1, count: 1 },
      { value: egg3, count: 1 },
    ])

    tray.remove([egg1, egg3])
    expect(tray.getItems()).toEqual([])

    tray.add([egg1, egg2, egg3])
    expect(tray.getItems()).toEqual([
      { value: egg1, count: 1 },
      { value: egg2, count: 1 },
      { value: egg3, count: 1 },
    ])
  })

  test('Egg tray works correctly with eternal eggs', () => {
    const tray = getEggTray()

    const egg1: Egg = {
      id: 'egg1',
      eternal: true,
      reducerMap: { ['test-1-1']: reducer1, ['test-1-2']: reducer2 },
      middlewares: [middleware1, middleware2],
    }

    const egg2: Egg = {
      id: 'egg2',
      eternal: true,
      reducerMap: { ['test-2']: reducer3 },
    }

    const egg3: Egg = {
      id: 'egg3',
      eternal: true,
      middlewares: [middleware3],
    }

    tray.add([egg1, egg2, egg3])
    expect(tray.getItems()).toEqual([
      { value: egg1, count: Infinity },
      { value: egg2, count: Infinity },
      { value: egg3, count: Infinity },
    ])

    tray.add([egg1, egg2, egg3])
    expect(tray.getItems()).toEqual([
      { value: egg1, count: Infinity },
      { value: egg2, count: Infinity },
      { value: egg3, count: Infinity },
    ])

    tray.remove([egg1, egg2, egg3])
    expect(tray.getItems()).toEqual([
      { value: egg1, count: Infinity },
      { value: egg2, count: Infinity },
      { value: egg3, count: Infinity },
    ])

    tray.remove([egg1, egg2, egg3])
    expect(tray.getItems()).toEqual([
      { value: egg1, count: Infinity },
      { value: egg2, count: Infinity },
      { value: egg3, count: Infinity },
    ])

    tray.remove([egg1, egg2, egg3])
    expect(tray.getItems()).toEqual([
      { value: egg1, count: Infinity },
      { value: egg2, count: Infinity },
      { value: egg3, count: Infinity },
    ])
  })
})
