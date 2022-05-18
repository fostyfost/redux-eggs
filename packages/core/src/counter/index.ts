import type { Counter, CounterItem } from '@/contracts'

const defaultEqualityCheck = <T>(left: T, right: T): boolean => left === right

const defaultKeepCheck = (): boolean => false

export const getCounter = <T = unknown>(
  equalityCheck: (left: T, right: T) => boolean = defaultEqualityCheck,
  keepCheck: (value: T) => boolean = defaultKeepCheck,
): Counter<T> => {
  const items: CounterItem<T>[] = []

  const getItem = (value: T): [CounterItem<T> | undefined, number] => {
    const index = items.findIndex(item => equalityCheck(item.value, value))
    return [items[index], index]
  }

  return {
    getCount(value: T): number {
      const [item] = getItem(value)
      return item?.count || 0
    },

    getItems() {
      return [...items]
    },

    add(value: T): void {
      const [item] = getItem(value)

      if (item && !keepCheck(item.value)) {
        item.count += 1
      } else if (!item) {
        items.push({ value, count: keepCheck(value) ? Infinity : 1 })
      }
    },

    remove(value: T): void {
      const [item, index] = getItem(value)

      if (item && !keepCheck(item.value)) {
        if (item.count > 1) {
          item.count -= 1
        } else {
          items.splice(index, 1)
        }
      }
    },
  }
}
