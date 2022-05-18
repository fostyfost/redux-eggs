import type { AnyFn, AnyMiddleware, MiddlewareTray } from '@/contracts'
import { getCounter } from '@/counter'

interface Item {
  mid: AnyMiddleware
  act: ReturnType<AnyMiddleware>
}

export const getMiddlewareTray = <T extends AnyFn = AnyFn>(middlewareComposer: T): MiddlewareTray => {
  const counter = getCounter<AnyMiddleware>()
  let items: Item[] = []
  let api: any

  return {
    dynamicMiddleware(middlewareApi: any): ReturnType<AnyMiddleware> {
      api = middlewareApi
      return next => action => middlewareComposer(...items.map(item => item.act))(next)(action)
    },

    add(middlewaresToAdd: AnyMiddleware[]): void {
      middlewaresToAdd.forEach(mid => {
        if (!counter.getCount(mid)) {
          items.push({ mid, act: mid(api) })
        }

        counter.add(mid)
      })
    },

    remove(middlewaresToRemove: AnyMiddleware[]): void {
      middlewaresToRemove.forEach(mid => {
        if (counter.getCount(mid) === 1) {
          items = items.filter(item => mid !== item.mid)
        }

        counter.remove(mid)
      })
    },
  }
}
