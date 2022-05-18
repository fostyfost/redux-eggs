import type { AnyFn, Egg, EggExt, Extension, IntersectItems, IsAny, IsNever } from '@redux-eggs/core'
import type { Action, AnyAction, Dispatch, Middleware, Store, StoreEnhancer } from 'redux'

export type ExtensionEventHandler<
  M extends Middleware = Middleware,
  E extends StoreEnhancer = StoreEnhancer,
  S = any,
  A extends Action = AnyAction,
> = (
  eggs: Egg[],
  store: Store<S, A> & {
    dispatch: ExtractDispatchExt<M> & Dispatch<A>
  } & ExtractStoreEnhancerExt<E> &
    EggExt,
) => any

export interface CreateStoreOptions<E extends Extension[] = Extension[]> {
  extensions?: E
  reducerCombiner?: AnyFn
  enhancersComposer?: AnyFn
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

export type EggStore<E extends Extension[] = Extension[], S = any, A extends Action = AnyAction> = Store<S, A> & {
  dispatch: ExtractDispatchExtensionsFromEggExtensions<[...E]> & Dispatch<A>
} & ExtractStoreExtensionsFromEggExtensions<[...E]> &
  EggExt
