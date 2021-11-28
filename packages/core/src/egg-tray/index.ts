import type { CounterItem, Egg } from '@/contracts'
import { getCounter } from '@/counter'

export interface EggTray {
  getItems(): CounterItem<Egg<any>>[]
  getCount(egg: Egg<any>): number
  add(eggs: Egg<any>[]): void
  remove(eggs: Egg<any>[]): void
}

export const getEggTray = () => {
  const counter = getCounter<Egg<any>>(
    (left, right) => left.id === right.id,
    item => !!item.keep,
  )

  return {
    getItems: counter.getItems,

    getCount: counter.getCount,

    add(eggsToAdd: Egg<any>[]): void {
      eggsToAdd.forEach(egg => counter.add(egg))
    },

    remove(eggsToRemove: Egg<any>[]): void {
      eggsToRemove.forEach(egg => counter.remove(egg))
    },
  }
}
