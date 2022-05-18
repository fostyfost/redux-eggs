// noinspection JSUnusedGlobalSymbols
export type IsAny<T, True, False = never> = true | false extends (T extends never ? true : false) ? True : False

// noinspection JSUnusedGlobalSymbols
export type IsNever<T, True = never, False = T> = [T] extends [never] ? True : False

type Intersect<T> = (T extends any ? (x: T) => 0 : never) extends (x: infer R) => 0 ? R : never

type TupleKeys<T extends any[]> = Exclude<keyof T, keyof []>

type Wrap<T extends any[]> = {
  [K in TupleKeys<T>]: { prop: T[K] }
}

type Unwrap<T> = T extends { prop: any } ? T['prop'] : never

type Values<T> = T[keyof T]

// noinspection JSUnusedGlobalSymbols
export type IntersectItems<T extends any[]> = Unwrap<Intersect<Values<Wrap<T>>>>

export type AnyFn<R = any> = (...args: any[]) => R

export type AnyReducer = (state: any, action: any) => any

export type ReducerEntry = readonly [string, AnyReducer]

export type AnyReducersMapObject = { [key: string]: AnyReducer }

export type CombineAnyReducers = (reducers: AnyReducersMapObject) => AnyReducer

export type AnyReduceHandler<S = any> = (
  store: S & EggExt,
  method: 'add' | 'remove',
  reducersMapObject: ReadonlyArray<ReducerEntry>,
) => any

export type AnyMiddleware = (api: any) => (...args: any[]) => AnyFn

export type AnyStoreEnhancer = (fn: AnyFn) => AnyFn

// TODO: Provide to redux and toolkit
export type EggEventHandler<Store = any> = (store: Store) => any

export interface Egg<Store = any> {
  readonly id: string | symbol
  reducersMap?: AnyReducersMapObject
  middlewares?: AnyMiddleware[]
  readonly keep?: boolean
  beforeAdd?: EggEventHandler<Store>
  afterAdd?: EggEventHandler<Store>
  beforeRemove?: EggEventHandler<Store>
  afterRemove?: EggEventHandler<Store>
}

export type EggTuple = (Egg | EggTuple)[]

export type ExtensionEventHandler<Store = any> = (eggs: Egg[], store: Store) => any

export interface Extension<
  M extends AnyMiddleware = AnyMiddleware,
  E extends AnyStoreEnhancer = AnyStoreEnhancer,
  H extends ExtensionEventHandler = ExtensionEventHandler,
> {
  middleware?: M
  enhancer?: E
  beforeAdd?: H
  afterAdd?: H
  beforeRemove?: H
  afterRemove?: H
}

export type RemoveAddedEggs = () => void

export interface EggExt {
  getEggs(): CounterItem<Egg>[]
  getEggCount(egg: Egg): number
  addEggs(...eggs: EggTuple): RemoveAddedEggs
}

export interface CounterItem<T> {
  value: T
  count: number
}

export interface Counter<T = unknown> {
  getCount(item: T): number
  getItems(): CounterItem<T>[]
  add(item: T): void
  remove(item: T): void
}

export interface EggTray {
  getItems(): CounterItem<Egg>[]
  getCount(egg: Egg): number
  add(eggs: Egg[]): void
  remove(eggs: Egg[]): void
}

export interface ReducerTray {
  dynamicReducer: AnyReducer
  add(entries: ReadonlyArray<ReducerEntry>): string[]
  remove(entries: ReadonlyArray<ReducerEntry>): string[]
}

export interface MiddlewareTray {
  dynamicMiddleware(api: any): AnyMiddleware
  add(middlewares: ReadonlyArray<AnyMiddleware>): void
  remove(middlewares: ReadonlyArray<AnyMiddleware>): void
}

export interface Core {
  dynamicReducer: AnyReducer
  dynamicMiddleware: AnyMiddleware
  coreEnhancer: AnyStoreEnhancer
  middlewares: AnyMiddleware[]
  enhancers: AnyStoreEnhancer[]
}
