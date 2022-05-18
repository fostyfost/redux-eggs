import type {
  AnyFn,
  AnyMiddleware,
  AnyReduceHandler,
  AnyStoreEnhancer,
  Core,
  Egg,
  EggExt,
  Extension,
  ReducerEntry,
} from '@/contracts'
import type { ExtensionEventHandler } from '@/contracts'
import { getCounter } from '@/counter'
import { getEggTray } from '@/egg-tray'
import { getMiddlewareTray } from '@/middleware-tray'
import { getReducerTray } from '@/reducer-tray'
import { flat, isNonEmptyArray } from '@/utils'

const extensionFields: ReadonlyArray<keyof Extension extends any ? keyof Extension : never> = [
  'enhancer',
  'middleware',
  'beforeAdd',
  'afterAdd',
  'beforeRemove',
  'afterRemove',
]

interface SuperExtension {
  enhancer: AnyStoreEnhancer[]
  middleware: AnyMiddleware[]
  beforeAdd: ExtensionEventHandler[]
  afterAdd: ExtensionEventHandler[]
  beforeRemove: ExtensionEventHandler[]
  afterRemove: ExtensionEventHandler[]
}

export const getCore = <S = any>(
  reducerCombiner: AnyFn,
  middlewareComposer: AnyFn,
  reduceHandler: AnyReduceHandler<S>,
  extensions: Extension[] = [],
): Core => {
  const { getItems, getCount, ...eggTray } = getEggTray()
  const { dynamicReducer, ...reducerTray } = getReducerTray(reducerCombiner)
  const { dynamicMiddleware, ...middlewareTray } = getMiddlewareTray(middlewareComposer)

  const { enhancer, middleware, ...ext } = extensions.reduce<SuperExtension>(
    (acc, extension) => {
      extensionFields.forEach(field => {
        const data = extension[field]
        if (data) {
          acc[field].push(data as any)
        }
      })

      return acc
    },
    extensionFields.reduce((acc, field) => {
      acc[field] = []
      return acc
    }, {} as SuperExtension),
  )

  const coreEnhancer: AnyStoreEnhancer = next => {
    return (...args) => {
      const store = next(...args) as S & EggExt

      const action = (
        eggs: Egg[],
        method: 'add' | 'remove',
        beforeEvent: 'beforeAdd' | 'beforeRemove',
        afterEvent: 'afterAdd' | 'afterRemove',
      ): Egg[] => {
        const idsCounter = getCounter<string | symbol>()

        const validEggs = eggs.filter(egg => {
          if (egg && egg.id && !idsCounter.getCount(egg.id)) {
            idsCounter.add(egg.id)
            return true
          }

          return false
        })

        if (isNonEmptyArray(validEggs)) {
          const actionableEggs: Egg[] = []
          const middlewares: AnyMiddleware[] = []
          const reducerEntries: ReducerEntry[] = []

          const isAdd = method === 'add'

          validEggs.forEach(egg => {
            const count = getCount(egg)

            if ((isAdd && !count) || (!isAdd && count === 1)) {
              actionableEggs.push(egg)

              if (isNonEmptyArray(egg.middlewares)) {
                middlewares.push(...egg.middlewares)
              }

              if (egg.reducersMap) {
                reducerEntries.push(...Object.entries(egg.reducersMap))
              }
            }
          })

          const isActionableEggsNonEmpty = isNonEmptyArray(actionableEggs)

          if (isActionableEggsNonEmpty) {
            ext[beforeEvent].forEach(handler => {
              handler(actionableEggs, store)
            })

            actionableEggs.forEach(egg => {
              const handler = egg[beforeEvent]
              if (handler) {
                handler(store)
              }
            })

            if (isNonEmptyArray(reducerEntries) && isNonEmptyArray(reducerTray[method](reducerEntries))) {
              reduceHandler(store, method, reducerEntries)
            }

            if (isNonEmptyArray(middlewares)) {
              middlewareTray[method](middlewares)
            }
          }

          eggTray[method](validEggs)

          if (isActionableEggsNonEmpty) {
            ext[afterEvent].forEach(handler => handler(actionableEggs, store))

            actionableEggs.forEach(egg => {
              const handler = egg[afterEvent]
              if (handler) {
                handler(store)
              }
            })
          }
        }

        return validEggs
      }

      store.addEggs = (...eggs) => {
        let eggsToRemove = action(flat(eggs), 'add', 'beforeAdd', 'afterAdd')

        return () => {
          action(eggsToRemove.reverse(), 'remove', 'beforeRemove', 'afterRemove')
          eggsToRemove = []
        }
      }

      store.getEggs = getItems
      store.getEggCount = getCount

      return store
    }
  }

  return {
    dynamicReducer,
    dynamicMiddleware,
    coreEnhancer,
    middlewares: middleware,
    enhancers: enhancer,
  }
}
