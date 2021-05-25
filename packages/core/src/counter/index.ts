export interface CountedItem<T> {
  value: T
  count: number
}

export interface Counter<T = unknown> {
  getCount(item: T): number
  getItems(): CountedItem<T>[]
  add(item: T): void
  remove(item: T): void
}

const defaultEqualityCheck = <T>(left: T, right: T): boolean => left === right

const defaultCheckIsEternal = (): boolean => false

export const getCounter = <T = unknown>(
  equalityCheck: (left: T, right: T) => boolean = defaultEqualityCheck,
  checkIsEternal: (value: T) => boolean = defaultCheckIsEternal,
): Counter<T> => {
  const countedItems: CountedItem<T>[] = []

  const getItem = (value: T): [CountedItem<T> | undefined, number] => {
    const index = countedItems.findIndex(item => equalityCheck(item.value, value))
    return [countedItems[index], index]
  }

  return {
    getCount(value: T): number {
      const [storeItem] = getItem(value)
      return storeItem?.count || 0
    },

    getItems() {
      return [...countedItems]
    },

    add(value: T): void {
      const [countedItem] = getItem(value)

      if (countedItem && !checkIsEternal(countedItem.value)) {
        countedItem.count += 1
      } else if (!countedItem) {
        countedItems.push({ value, count: checkIsEternal(value) ? Infinity : 1 })
      }
    },

    remove(value: T): void {
      const [countedItem, index] = getItem(value)

      if (countedItem && !checkIsEternal(countedItem.value)) {
        if (countedItem.count > 1) {
          countedItem.count -= 1
        } else {
          countedItems.splice(index, 1)
        }
      }
    },
  }
}
