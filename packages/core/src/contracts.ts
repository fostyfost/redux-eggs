import type { Middleware, ReducersMapObject, Store, StoreEnhancer } from 'redux'

import type { CountedItem } from '@/counter'

export type EggEventHandler<S extends Store = Store> = (store: S) => void

export interface Egg<S extends Store = Store> {
  readonly id: string
  reducerMap?: ReducersMapObject<any, any>
  middlewares?: Middleware[]
  readonly eternal?: boolean
  beforeAdd?: EggEventHandler<S>
  afterAdd?: EggEventHandler<S>
  beforeRemove?: EggEventHandler<S>
  afterRemove?: EggEventHandler<S>
  // TODO: [key: string]: any
}

export type EggTuple = (Egg<any> | EggTuple)[]

export type ExtensionEventHandler<S extends Store = Store> = (eggs: Egg<S>[], store: S) => void

export interface ExtensionEventHandlers<S extends Store = Store> {
  beforeAdd?: ExtensionEventHandler<S>[]
  afterAdd?: ExtensionEventHandler<S>[]
  beforeRemove?: ExtensionEventHandler<S>[]
  afterRemove?: ExtensionEventHandler<S>[]
}

export interface Extension<S extends Store = Store> extends ExtensionEventHandlers<S> {
  middlewares?: Middleware[]
  enhancers?: StoreEnhancer<any, any>[]
}

export type RemoveAddedEggs = () => void

export type EggExt = {
  getEggs(): CountedItem<Egg>[]
  getEggCount(egg: Egg): number
  addEggs(eggsToBeAdded: EggTuple): RemoveAddedEggs
  removeEggs(eggsToBeRemoved: EggTuple): void
}
