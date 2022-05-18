import type { Counter, CounterItem, ReducerEntry } from '@/contracts'
import * as CounterModule from '@/counter'
import { getReducerTray } from '@/reducer-tray'

describe('Tests for reducer tray', () => {
  const buildCounterGetter = () => {
    let mockedCounter: Counter<string>

    const { getCounter } = jest.requireActual('@/counter')

    jest.spyOn(CounterModule, 'getCounter').mockImplementationOnce((...args) => {
      mockedCounter = getCounter(...args)
      return mockedCounter
    })

    return () => mockedCounter
  }

  test('Reducers should be added to and removed from tray correctly', () => {
    const entry1: ReducerEntry = ['reducer1', () => ({})]
    const entry2: ReducerEntry = ['reducer2', () => ({})]

    const getCounter = buildCounterGetter()

    const tray = getReducerTray(() => () => ({}))
    expect(getCounter().getItems()).toEqual([])

    tray.add([])
    expect(getCounter().getItems()).toEqual([])

    tray.remove([])
    expect(getCounter().getItems()).toEqual([])

    tray.add([entry1, entry2])
    expect(getCounter().getCount(entry1[0])).toEqual(1)
    expect(getCounter().getCount(entry2[0])).toEqual(1)

    tray.add([entry1, entry2])
    expect(getCounter().getCount(entry1[0])).toEqual(2)
    expect(getCounter().getCount(entry2[0])).toEqual(2)

    const fullTray: CounterItem<string>[] = [
      { count: 2, value: entry1[0] },
      { count: 2, value: entry2[0] },
    ]

    tray.add([])
    expect(getCounter().getItems()).toEqual(fullTray)

    tray.remove([])
    expect(getCounter().getItems()).toEqual(fullTray)

    tray.remove([entry1, entry2])
    expect(getCounter().getCount(entry1[0])).toEqual(1)
    expect(getCounter().getCount(entry2[0])).toEqual(1)

    tray.remove([entry1, entry2])
    expect(getCounter().getCount(entry1[0])).toEqual(0)
    expect(getCounter().getCount(entry2[0])).toEqual(0)

    tray.remove([entry1, entry2])
    expect(getCounter().getItems()).toEqual([])

    tray.add([entry1, entry2, entry1, entry2])
    expect(getCounter().getCount(entry1[0])).toEqual(2)
    expect(getCounter().getCount(entry2[0])).toEqual(2)

    tray.remove([entry1, entry2, entry1, entry2])
    expect(getCounter().getItems()).toEqual([])
  })

  test('Reducer tray works correctly with custom reducer combiner', () => {
    const anyState = {}
    const anyAction = { type: 'action' } as const

    const entry1: ReducerEntry = ['reducer1', jest.fn()]
    const entry2: ReducerEntry = ['reducer2', jest.fn()]

    const combinerResult = jest.fn()
    const combiner = jest.fn()
    combiner.mockReturnValue(combinerResult)

    const tray = getReducerTray(combiner)

    tray.add([])
    tray.dynamicReducer(anyState, anyAction)
    expect(combiner).not.toBeCalled()

    tray.remove([])
    tray.dynamicReducer(anyState, anyAction)
    expect(combiner).not.toBeCalled()

    tray.add([entry1, entry2])
    tray.dynamicReducer(undefined, anyAction)
    expect(combiner).toBeCalledTimes(1)
    expect(combiner).nthCalledWith(1, { [entry1[0]]: entry1[1], [entry2[0]]: entry2[1] })
    expect(combinerResult).toBeCalledTimes(1)
    expect(combinerResult).nthCalledWith(1, anyState, anyAction)
    tray.dynamicReducer(anyState, anyAction)
    expect(combiner).toBeCalledTimes(1)
    expect(combiner).nthCalledWith(1, { [entry1[0]]: entry1[1], [entry2[0]]: entry2[1] })
    expect(combinerResult).toBeCalledTimes(2)
    expect(combinerResult).nthCalledWith(2, anyState, anyAction)

    tray.add([entry1, entry2])
    tray.dynamicReducer(anyState, anyAction)
    expect(combiner).toBeCalledTimes(1)
    expect(combinerResult).toBeCalledTimes(3)
    expect(combinerResult).nthCalledWith(3, anyState, anyAction)

    tray.add([])
    tray.dynamicReducer(anyState, anyAction)
    expect(combiner).toBeCalledTimes(1)
    expect(combinerResult).toBeCalledTimes(4)
    expect(combinerResult).nthCalledWith(4, anyState, anyAction)

    tray.remove([])
    tray.dynamicReducer(anyState, anyAction)
    expect(combiner).toBeCalledTimes(1)
    expect(combinerResult).toBeCalledTimes(5)
    expect(combinerResult).nthCalledWith(5, anyState, anyAction)

    tray.remove([entry1, entry2])
    tray.dynamicReducer(anyState, anyAction)
    expect(combiner).toBeCalledTimes(1)
    expect(combinerResult).toBeCalledTimes(6)
    expect(combinerResult).nthCalledWith(6, anyState, anyAction)

    tray.remove([entry1, entry2])
    tray.dynamicReducer(anyState, anyAction)
    expect(combiner).toBeCalledTimes(2)
    expect(combiner).nthCalledWith(2, {})
    expect(combinerResult).toBeCalledTimes(6)

    tray.remove([entry1, entry2])
    tray.dynamicReducer(anyState, anyAction)
    expect(combiner).toBeCalledTimes(2)
    expect(combinerResult).toBeCalledTimes(6)

    tray.add([entry1, entry2, entry1, entry2])
    tray.dynamicReducer(anyState, anyAction)
    expect(combiner).toBeCalledTimes(3)
    expect(combiner).nthCalledWith(3, { [entry1[0]]: entry1[1], [entry2[0]]: entry2[1] })
    expect(combinerResult).toBeCalledTimes(7)
    expect(combinerResult).nthCalledWith(7, anyState, anyAction)

    tray.remove([entry1, entry2, entry1, entry2])
    tray.dynamicReducer(anyState, anyAction)
    expect(combiner).toBeCalledTimes(4)
    expect(combiner).nthCalledWith(4, {})
    expect(combinerResult).toBeCalledTimes(7)
  })
})
