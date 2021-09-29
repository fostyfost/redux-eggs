import type { Egg, EggTuple } from '@/contracts'

export const flat = (tuple: EggTuple): Egg[] => {
  const result: Egg[] = []

  const flat = (tuple: EggTuple): void => {
    tuple.forEach(item => {
      if (Array.isArray(item)) {
        flat(item)
      } else {
        result.push(item)
      }
    })
  }

  if (Array.isArray(tuple)) {
    flat(tuple)
  }

  return result
}
