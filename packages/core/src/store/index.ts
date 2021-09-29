import type { combineReducers, compose, Middleware, Reducer, Store, StoreEnhancer } from 'redux'

import type { Egg, EggExt, EggTuple, Extension, RemoveAddedEggs } from '@/contracts'
import { getEggTray } from '@/egg-tray'
import { flat } from '@/flat'
import { getMiddlewareTray } from '@/middleware-tray'
import type { ReducerEntry } from '@/reducer-tray'
import { getReducerTray } from '@/reducer-tray'

export type StoreCreator<S extends Store = Store> = (
  reducer: Reducer,
  middlewareEnhancer: Middleware,
  enhancersFromExtensions: StoreEnhancer<any, any>[],
  middlewaresFromExtensions: Middleware[],
) => S

const extensionFields: Array<keyof Extension extends any ? keyof Extension : never> = [
  'enhancers',
  'middlewares',
  'beforeAdd',
  'afterAdd',
  'beforeRemove',
  'afterRemove',
]

export const REDUCE_ACTION_TYPE = '@@eggs/reduce'

export const buildStore = <S extends Store = Store>(
  storeCreator: StoreCreator<S>,
  combiner: typeof combineReducers,
  composeMiddleware: typeof compose,
  extensions: Extension[] = [],
): S & EggExt => {
  const ext = extensions.reduce<Required<Extension>>(
    (acc, extension) => {
      extensionFields.forEach(field => {
        const data = extension[field]
        if (data?.length) {
          acc[field].push(...(data as any))
        }
      })

      return acc
    },
    extensionFields.reduce((acc, field) => {
      acc[field] = []
      return acc
    }, {} as Required<Extension>),
  )

  const eggTray = getEggTray()
  const middlewareTray = getMiddlewareTray(composeMiddleware)
  const reducerTray = getReducerTray(combiner)

  const store = storeCreator(reducerTray.reducer, middlewareTray.mid, ext.enhancers, ext.middlewares)

  const action = (
    eggs: Egg[],
    method: 'add' | 'remove',
    beforeEvent: 'beforeAdd' | 'beforeRemove',
    afterEvent: 'afterAdd' | 'afterRemove',
  ): void => {
    const validEggs = eggs.filter(egg => egg.id)

    if (validEggs.length) {
      const actionEggs: Egg[] = []
      const middlewares: Middleware[] = []
      const reducers: ReducerEntry[] = []

      const isAdd = method === 'add'

      validEggs.forEach(egg => {
        const count = eggTray.getCount(egg)

        if ((isAdd && !count) || (!isAdd && count === 1)) {
          actionEggs.push(egg)

          if (egg.middlewares?.length) {
            middlewares.push(...egg.middlewares)
          }

          if (egg.reducerMap) {
            reducers.push(...Object.entries(egg.reducerMap))
          }
        }
      })

      const actionEggsLength = actionEggs.length

      if (actionEggsLength) {
        ext[beforeEvent].forEach(handler => handler(actionEggs, store))

        actionEggs.forEach(egg => egg[beforeEvent]?.(store))

        if (reducerTray[method](reducers).length) {
          store.dispatch({ type: REDUCE_ACTION_TYPE })
        }

        middlewareTray[method](middlewares)
      }

      eggTray[method](validEggs)

      if (actionEggsLength) {
        ext[afterEvent].forEach(handler => handler(actionEggs, store))

        actionEggs.forEach(egg => egg[afterEvent]?.(store))
      }
    }
  }

  const add = (eggs: Egg[]): void => action(eggs, 'add', 'beforeAdd', 'afterAdd')
  const remove = (eggs: Egg[]): void => action(eggs, 'remove', 'beforeRemove', 'afterRemove')

  return Object.assign(store, {
    getEggs: eggTray.getItems,

    getEggCount: eggTray.getCount,

    addEggs(eggsToBeAdded: EggTuple): RemoveAddedEggs {
      const flattenedEggs = flat(eggsToBeAdded)
      add(flattenedEggs)
      return (): void => remove([...flattenedEggs].reverse())
    },

    removeEggs(eggsToBeRemoved: EggTuple): void {
      remove(flat(eggsToBeRemoved))
    },
  })
}
