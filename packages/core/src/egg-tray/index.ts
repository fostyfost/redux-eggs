import type { Egg } from '@/contracts'
import type { CountedItem } from '@/counter'
import { getCounter } from '@/counter'

export type GetEggsStore = () => {
  getItems(): CountedItem<Egg>[]
  getCount(egg: Egg): number
  add(eggs: Egg[]): void
  remove(eggs: Egg[]): void
}

export const getEggTray: GetEggsStore = () => {
  const counter = getCounter<Egg>(
    (left, right) => left.id === right.id,
    item => !!item.eternal,
  )

  return {
    getItems: counter.getItems,

    getCount: counter.getCount,

    add(eggsToAdd: Egg[]): void {
      eggsToAdd.forEach(egg => counter.add(egg))
    },

    remove(eggsToRemove: Egg[]): void {
      eggsToRemove.forEach(egg => counter.remove(egg))
    },
  }
}
