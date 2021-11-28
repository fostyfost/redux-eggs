import type { Middleware, ReducersMapObject, Store, StoreEnhancer } from 'redux'

/**
 * Checks if type `T` is the `any` type.
 * @see https://stackoverflow.com/a/49928360/3406963
 * @see https://github.com/dsherret/conditional-type-checks/blob/main/mod.ts
 */
type IsAny<T> = 0 extends 1 & T ? true : false

export type WithEggExt<S> = IsAny<S> extends false
  ? S extends Store<any, any>
    ? S extends EggExt
      ? S
      : EggExt & S
    : EggExt & Store
  : EggExt & Store

export type EggEventHandler<S extends Store = Store> = (store: WithEggExt<S>) => void

export interface Egg<S extends Store = Store> {
  readonly id: string
  reducersMap?: ReducersMapObject<any, any>
  middlewares?: Middleware[]
  readonly keep?: boolean
  beforeAdd?: EggEventHandler<S>
  afterAdd?: EggEventHandler<S>
  beforeRemove?: EggEventHandler<S>
  afterRemove?: EggEventHandler<S>
}

export type EggTuple<S extends Store = Store> = (Egg<S> | EggTuple<S>)[]

export type ExtensionEventHandler<S extends Store = Store> = (eggs: Egg<S>[], store: WithEggExt<S>) => void

export interface Extension<S extends Store = Store> {
  middlewares?: Middleware[]
  enhancers?: StoreEnhancer<any, any>[]
  beforeAdd?: ExtensionEventHandler<S>[]
  afterAdd?: ExtensionEventHandler<S>[]
  beforeRemove?: ExtensionEventHandler<S>[]
  afterRemove?: ExtensionEventHandler<S>[]
}

export type RemoveAddedEggs = () => void

export interface EggExt {
  getEggs(): CounterItem<Egg<any>>[]
  getEggCount(egg: Egg<any>): number
  addEggs(eggsToBeAdded: EggTuple<any>): RemoveAddedEggs
  removeEggs(eggsToBeRemoved: EggTuple<any>): void
}

export interface CounterItem<T> {
  value: T
  count: number
}
