import type {
  AnyFn,
  CounterItem,
  Egg,
  EggTuple,
  Extension,
  IntersectItems,
  IsAny,
  IsNever,
  RemoveAddedEggs,
} from '@redux-eggs/core'
import type {
  Action,
  AnyAction,
  ConfigureStoreOptions,
  Dispatch,
  EnhancedStore,
  Middleware,
  Store,
  StoreEnhancer,
} from '@reduxjs/toolkit'
import type { CurriedGetDefaultMiddleware } from '@reduxjs/toolkit/dist/getDefaultMiddleware'

export type ExtensionEventHandler<
  M extends Middleware = Middleware,
  E extends StoreEnhancer = StoreEnhancer,
  S = any,
  A extends Action = AnyAction,
  R = any,
> = (
  eggs: Egg[],
  store: Store<S, A> & {
    dispatch: ExtractDispatchExt<M> & Dispatch<A>
  } & ExtractStoreEnhancerExt<E> &
    EggExt,
) => R

export interface EggExt {
  getEggs(): CounterItem<Egg>[]
  getEggCount(egg: Egg): number
  addEggs(...eggs: EggTuple): RemoveAddedEggs
}

export interface CreateStoreOptions<
  E extends Extension[] = Extension[],
  S = any,
  M extends Middleware[] = Middleware[],
> {
  extensions?: E
  reducerCombiner?: AnyFn
  middleware?: ((getDefaultMiddleware: CurriedGetDefaultMiddleware<S>) => M) | M
  devTools?: ConfigureStoreOptions['devTools']
}

export type ExtractDispatchExt<T> = T extends Middleware<infer Ext> ? IsAny<Ext, {}, Ext> : {}

export type ExtractStoreEnhancerExt<T> = T extends StoreEnhancer<infer Ext> ? IsAny<Ext, {}, Ext> : {}

export type ExtractDispatchExtensions<EggExtensions extends any[], Acc extends any[]> = EggExtensions extends [
  infer Head,
  ...infer Tail,
]
  ? ExtractDispatchExtensions<
      Tail,
      [...Acc, Head extends Extension<infer MiddlewareType> ? ExtractDispatchExt<MiddlewareType> : {}]
    >
  : Acc

export type ExtractStoreExtensions<EggExtensions extends any[], Acc extends any[]> = EggExtensions extends [
  infer Head,
  ...infer Tail,
]
  ? ExtractStoreExtensions<
      Tail,
      [...Acc, Head extends Extension<any, infer EnhancerType> ? ExtractStoreEnhancerExt<EnhancerType> : {}]
    >
  : Acc

export type ExtractDispatchExtensionsFromEggExtensions<EggExtensions> = EggExtensions extends any[]
  ? IsNever<IntersectItems<ExtractDispatchExtensions<[...EggExtensions], []>>, {}>
  : {}

export type ExtractStoreExtensionsFromEggExtensions<EggExtensions> = EggExtensions extends any[]
  ? IsNever<IntersectItems<ExtractStoreExtensions<[...EggExtensions], []>>, {}>
  : {}

export type EggStore<
  E extends Extension[] = Extension[],
  S = any,
  A extends Action = AnyAction,
  M extends Middleware[] = Middleware[],
> = EnhancedStore<S, A, M> & {
  dispatch: ExtractDispatchExtensionsFromEggExtensions<[...E]> & Dispatch<A>
} & ExtractStoreExtensionsFromEggExtensions<[...E]> &
  EggExt
