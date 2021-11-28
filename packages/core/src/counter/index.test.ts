import type { CounterItem } from '@/contracts'
import { getCounter } from '@/counter'

describe('Tests for counter', () => {
  test('Counter works with functions', () => {
    const noop1 = () => null
    const noop2 = () => null

    const counter = getCounter()

    expect(counter.getCount(noop1)).toBe(0)
    expect(counter.getItems()).toEqual([])

    counter.add(noop1)
    expect(counter.getCount(noop1)).toBe(1)
    expect(counter.getItems()).toEqual([{ value: noop1, count: 1 }])

    counter.add(noop2)
    expect(counter.getCount(noop1)).toBe(1)
    expect(counter.getCount(noop2)).toBe(1)
    expect(counter.getItems()).toEqual([
      { value: noop1, count: 1 },
      { value: noop2, count: 1 },
    ])

    counter.add(noop2)
    expect(counter.getCount(noop1)).toBe(1)
    expect(counter.getCount(noop2)).toBe(2)
    expect(counter.getItems()).toEqual([
      { value: noop1, count: 1 },
      { value: noop2, count: 2 },
    ])

    counter.remove(noop2)
    expect(counter.getCount(noop1)).toBe(1)
    expect(counter.getCount(noop2)).toBe(1)
    expect(counter.getItems()).toEqual([
      { value: noop1, count: 1 },
      { value: noop2, count: 1 },
    ])

    counter.remove(noop2)
    expect(counter.getCount(noop1)).toBe(1)
    expect(counter.getCount(noop2)).toBe(0)
    expect(counter.getItems()).toEqual([{ value: noop1, count: 1 }])

    counter.remove(noop2)
    expect(counter.getCount(noop1)).toBe(1)
    expect(counter.getCount(noop2)).toBe(0)
    expect(counter.getItems()).toEqual([{ value: noop1, count: 1 }])

    counter.remove(noop1)
    expect(counter.getCount(noop1)).toBe(0)
    expect(counter.getCount(noop2)).toBe(0)
    expect(counter.getItems()).toEqual([])
  })

  test('Counter works with strings and numbers', () => {
    const data = {
      value1: '1',
      value2: 1,
      value3: 'str',
      value4: NaN,
      value5: '0',
      value6: 0,
    }

    const counter = getCounter<string | number>(Object.is)

    const values = Object.values(data)

    values.forEach(value => {
      counter.add(value)
      expect(counter.getCount(value)).toBe(1)
    })
    expect(counter.getItems()).toEqual(values.map(value => ({ value, count: 1 })))

    values.forEach(value => {
      counter.add(value)
      expect(counter.getCount(value)).toBe(2)
    })
    expect(counter.getItems()).toEqual(values.map(value => ({ value, count: 2 })))

    values.forEach(value => {
      counter.remove(value)
      expect(counter.getCount(value)).toBe(1)
    })
    expect(counter.getItems()).toEqual(values.map(value => ({ value, count: 1 })))

    values.forEach(value => {
      counter.remove(value)
      expect(counter.getCount(value)).toBe(0)
    })
    expect(counter.getItems()).toEqual([])

    values.forEach(value => {
      counter.remove(value)
      expect(counter.getCount(value)).toBe(0)
    })
    expect(counter.getItems()).toEqual([])

    expect(counter.getCount(Number.NaN)).toBe(0)
    expect(counter.getItems()).toEqual([])

    expect(counter.getCount(NaN)).toBe(0)
    expect(counter.getItems()).toEqual([])

    counter.add(Number.NaN)
    expect(counter.getCount(Number.NaN)).toBe(1)
    expect(counter.getItems()).toEqual([{ value: Number.NaN, count: 1 }])

    counter.add(NaN)
    expect(counter.getCount(NaN)).toBe(2)
    expect(counter.getItems()).toEqual([{ value: NaN, count: 2 }])
    expect(counter.getItems()).toEqual([{ value: NaN, count: 2 }])

    counter.remove(Number.NaN)
    expect(counter.getCount(Number.NaN)).toBe(1)
    expect(counter.getItems()).toEqual([{ value: Number.NaN, count: 1 }])

    counter.remove(NaN)
    expect(counter.getCount(NaN)).toBe(0)
    expect(counter.getItems()).toEqual([])
  })

  test('Counter works with eternal items', () => {
    interface Item {
      value: number
      keep?: boolean
    }

    const values: Item[] = [
      {
        value: 1,
        keep: true,
      },
      {
        value: 2,
        keep: false,
      },
      {
        value: 3,
      },
      {
        value: 4,
        keep: true,
      },
      {
        value: 5,
        keep: true,
      },
    ]

    const keepCheck = (item: Item): boolean => !!item.keep
    const counter = getCounter<Item>(undefined, keepCheck)

    values.forEach(item => expect(counter.getCount(item)).toBe(0))
    expect(counter.getItems()).toEqual([])

    const mapper = (value: Item, expectedCount: number): CounterItem<Item> => {
      return {
        value,
        count: keepCheck(value) ? Infinity : expectedCount,
      }
    }

    const filter = (item: CounterItem<Item>) => item.count > 0

    values.forEach(item => {
      counter.add(item)
      expect(counter.getCount(item)).toBe(keepCheck(item) ? Infinity : 1)
    })
    expect(counter.getItems()).toEqual(values.map(value => mapper(value, 1)).filter(filter))

    values.forEach(item => {
      counter.add(item)
      expect(counter.getCount(item)).toBe(keepCheck(item) ? Infinity : 2)
    })
    expect(counter.getItems()).toEqual(values.map(value => mapper(value, 2)).filter(filter))

    values.forEach(item => {
      counter.remove(item)
      expect(counter.getCount(item)).toBe(keepCheck(item) ? Infinity : 1)
    })
    expect(counter.getItems()).toEqual(values.map(value => mapper(value, 1)).filter(filter))

    values.forEach(item => {
      counter.remove(item)
      expect(counter.getCount(item)).toBe(keepCheck(item) ? Infinity : 0)
    })
    expect(counter.getItems()).toEqual(values.map(value => mapper(value, 0)).filter(filter))

    values.forEach(item => {
      counter.remove(item)
      expect(counter.getCount(item)).toBe(keepCheck(item) ? Infinity : 0)
    })
    expect(counter.getItems()).toEqual(values.map(value => mapper(value, 0)).filter(filter))
  })
})
