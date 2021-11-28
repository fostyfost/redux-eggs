import type { Egg, EggTuple } from '@/contracts'

const isArray = Array.isArray

export const flat = (tuple: EggTuple<any>): Egg<any>[] => {
  const result: Egg[] = []

  const flatten = (tuple: EggTuple<any>): void => {
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
