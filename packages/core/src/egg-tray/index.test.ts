import type { AnyMiddleware, AnyReducer, Egg, EggTray } from '@/contracts'
import { getEggTray } from '@/egg-tray'

describe('Tests for eggs tray', () => {
  const middleware1: AnyMiddleware = () => next => action => next(action)
  const middleware2: AnyMiddleware = () => next => action => next(action)
  const middleware3: AnyMiddleware = () => next => action => next(action)

  const reducer1: AnyReducer = () => ({ value: 1 })
  const reducer2: AnyReducer = () => ({ value: 2 })
  const reducer3: AnyReducer = () => ({ value: 3 })

  test('Eggs should be added to and removed from tray correctly', () => {
    const tray: EggTray = getEggTray()

    expect(tray.getItems()).toEqual([])

    const egg1: Egg = {
      id: 'egg1',
      reducersMap: { ['test-1-1']: reducer1, ['test-1-2']: reducer2 },
      middlewares: [middleware1, middleware2],
    }

    const egg2: Egg = {
      id: 'egg2',
      reducersMap: { ['test-2']: reducer3 },
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
    const tray: EggTray = getEggTray()

    const egg1: Egg = {
      id: 'egg1',
      keep: true,
      reducersMap: { ['test-1-1']: reducer1, ['test-1-2']: reducer2 },
      middlewares: [middleware1, middleware2],
    }

    const egg2: Egg = {
      id: 'egg2',
      keep: true,
      reducersMap: { ['test-2']: reducer3 },
    }

    const egg3: Egg = {
      id: 'egg3',
      keep: true,
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
