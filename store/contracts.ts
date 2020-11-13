import { NextComponentType, NextPageContext } from 'next'
import { AppContext } from 'next/app'
import { Action } from 'redux'
import { IModule } from 'redux-dynamic-modules-core'

import { ModuleStoreWithSagaTasks, SagaModule } from './saga-extension/contracts'

type ModuleTupleRecursive<Module extends IModule<any> = IModule<any>> = Module | ModuleTuple

export type ModuleTuple<Module extends IModule<any> = IModule<any>> = Array<ModuleTupleRecursive<Module>>

export const STOREKEY = '__NEXT_REDUX_WRAPPER_STORE__' as const

export interface WindowWithStore extends Window {
  [STOREKEY]: ModuleStoreWithSagaTasks
}

export interface WrapperProps {
  initialProps: any // stuff returned from getInitialProps
  initialState: any // stuff in the Store state after getInitialProps
  getInitialSsrStore?: () => ModuleStoreWithSagaTasks // Вернёт стор, сформированный на SSR
}

export type NextPageWithStore<P = Record<string, unknown>, IP = Record<string, unknown>, S = any> = NextComponentType<
  NextPageContext & { store: ModuleStoreWithSagaTasks<S> },
  IP,
  P
>

export type NextPageWithModules<
  P = Record<string, unknown>,
  IP = Record<string, unknown>,
  S = any,
  R extends Action = any
> = NextPageWithStore<P, IP, S> & {
  modules: SagaModule<S, R>[]
}

export type AppContextWithModules = AppContext & { Component: NextPageWithModules }

export interface GetStoreParams {
  rootModules?: ModuleTuple<any>
  pageModules?: ModuleTuple<any>
  context?: AppContextWithModules
  initialState?: any
}
