import type { compose, Middleware, MiddlewareAPI } from 'redux'

import { getCounter } from '@/counter'

interface Item {
  mid: Middleware
  applied: ReturnType<Middleware>
}

export type GetMiddlewareTray = (composeMiddlewares: typeof compose) => {
  mid: Middleware
  add(middlewares: Middleware[]): void
  remove(middlewares: Middleware[]): void
}

export const getMiddlewareTray: GetMiddlewareTray = composeMiddlewares => {
  const counter = getCounter<Middleware>()
  let items: Item[] = []
  let api: MiddlewareAPI

  return {
    mid(store): ReturnType<Middleware> {
      api = store
      return next => action => composeMiddlewares<Middleware>(...items.map(item => item.applied))(next)(action)
    },

    add(middlewaresToAdd: Middleware[]): void {
      middlewaresToAdd.forEach(mid => {
        if (!counter.getCount(mid)) {
          items.push({ mid, applied: mid(api) })
        }

        counter.add(mid)
      })
    },

    remove(middlewaresToRemove: Middleware[]): void {
      middlewaresToRemove.forEach(middleware => {
        if (counter.getCount(middleware) === 1) {
          items = items.filter(item => middleware !== item.mid)
        }

        counter.remove(middleware)
      })
    },
  }
}
