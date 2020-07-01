import { NextComponentType, NextPageContext } from 'next'
import { AppContext } from 'next/app'
import { Action } from 'redux'
import { IModule } from 'redux-dynamic-modules-core'

import { STOREKEY } from './index'
import { ModuleStoreWithSagaTasks, SagaModule } from './saga-extension/contracts'

type ModuleTupleRecursive<Module extends IModule<any> = IModule<any>> = Module | ModuleTuple

export interface ModuleTuple<Module extends IModule<any> = IModule<any>> extends Array<ModuleTupleRecursive<Module>> {}

export interface WindowWithStore extends Window {
  [STOREKEY]: ModuleStoreWithSagaTasks
}

export interface WrapperProps {
  initialProps: any // stuff returned from getInitialProps
  initialState: any // stuff in the Store state after getInitialProps
}

export type NextPageWithStore<P = {}, IP = {}, S = any> = NextComponentType<
  NextPageContext & { store: ModuleStoreWithSagaTasks<S> },
  IP,
  P
>

export type NextPageWithModules<P = {}, IP = {}, S = any, R extends Action = any> = NextPageWithStore<P, IP, S> & {
  modules: SagaModule<S, R>[]
}

export type AppContextWithModules = AppContext & { Component: NextPageWithModules }

export interface GetStoreParams {
  rootModules?: ModuleTuple
  pageModules?: ModuleTuple
  context?: AppContextWithModules
}
