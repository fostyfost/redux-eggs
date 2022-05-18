import type { EggTuple } from '@/contracts'
import type { Egg } from '@/contracts'
import { flat, isNonEmptyArray } from '@/utils'

test('Tests for `flat`', () => {
  const eggTuple1: EggTuple = [
    [[{ id: '1' }], { id: '2' }, [{ id: '3' }, { id: '4' }, [{ id: '5' }, [{ id: '6' }, { id: '7' }, [{ id: '8' }]]]]],
    { id: '9' },
    [[[[[[[{ id: '10' }]]]]]]],
  ]

  const result1: Egg[] = [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
    { id: '9' },
    { id: '10' },
  ]

  expect(flat(eggTuple1)).toEqual(result1)

  const eggTuple2: EggTuple = [{ id: '50' }, { id: '40' }, { id: '30' }, { id: '20' }, { id: '10' }]

  const result2: Egg[] = [{ id: '50' }, { id: '40' }, { id: '30' }, { id: '20' }, { id: '10' }]

  expect(flat(eggTuple2)).toEqual(result2)

  expect(flat(undefined as unknown as EggTuple)).toEqual([])
})

test('Tests for `isNonEmptyArray`', () => {
  expect(isNonEmptyArray(undefined)).toBe(false)
  expect(isNonEmptyArray(void 0)).toBe(false)
  expect(isNonEmptyArray([])).toBe(false)
  expect(isNonEmptyArray([[]])).toBe(true)
  expect(isNonEmptyArray([1, 2, 3])).toBe(true)

  const arr: any[] = []
  arr.length = 1
  expect(isNonEmptyArray(arr)).toBe(true)
})
