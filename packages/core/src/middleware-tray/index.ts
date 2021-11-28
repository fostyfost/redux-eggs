import type { compose, Middleware, MiddlewareAPI } from 'redux'

import { getCounter } from '@/counter'

interface Item {
  mid: Middleware
  act: ReturnType<Middleware>
}

export interface MiddlewareTray {
  mid: Middleware
  add(middlewares: Middleware[]): void
  remove(middlewares: Middleware[]): void
}

export const getMiddlewareTray = <T extends typeof compose = typeof compose>(composeMiddlewares: T): MiddlewareTray => {
  const counter = getCounter<Middleware>()
  let items: Item[] = []
  let api: MiddlewareAPI

  return {
    mid(store): ReturnType<Middleware> {
      api = store
      return next => action => composeMiddlewares<Middleware>(...items.map(item => item.act))(next)(action)
    },

    add(middlewaresToAdd: Middleware[]): void {
      middlewaresToAdd.forEach(mid => {
        if (!counter.getCount(mid)) {
          items.push({ mid, act: mid(api) })
        }

        counter.add(mid)
      })
    },

    remove(middlewaresToRemove: Middleware[]): void {
      middlewaresToRemove.forEach(mid => {
        if (counter.getCount(mid) === 1) {
          items = items.filter(item => mid !== item.mid)
        }

        counter.remove(mid)
      })
    },
  }
}
