import type { Egg, EggTuple } from '@/contracts'

const isArray = Array.isArray

export const flat = (tuple: EggTuple): Egg[] => {
  const result: Egg[] = []

  const flatten = (tuple: EggTuple): void => {
    tuple.forEach(item => {
      if (isArray(item)) {
        flatten(item)
      } else {
        result.push(item)
      }
    })
  }

  if (isArray(tuple)) {
    flatten(tuple)
  }

  return result
}
