import type { Egg, EggTray } from '@/contracts'
import { getCounter } from '@/counter'

export const getEggTray = (): EggTray => {
  const counter = getCounter<Egg>(
    (left, right) => left.id === right.id,
    item => !!item.keep,
  )

  return {
    getItems: counter.getItems,

    getCount: counter.getCount,

    add(eggsToAdd: Egg[]): void {
      eggsToAdd.forEach(counter.add)
    },

    remove(eggsToRemove: Egg[]): void {
      eggsToRemove.forEach(counter.remove)
    },
  }
}
