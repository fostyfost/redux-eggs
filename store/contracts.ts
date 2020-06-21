import { NextComponentType, NextPageContext } from 'next'
import { AppContext } from 'next/app'
import { Action } from 'redux'
import { IModule } from 'redux-dynamic-modules-core'

import { STOREKEY } from './index'
import { IModuleStoreWithSagaTasks, ISagaModule } from './saga-extension/contracts'

type IModuleTupleRecursive<Module extends IModule<any> = IModule<any>> = Module | IModuleTuple

export interface IModuleTuple<Module extends IModule<any> = IModule<any>>
  extends Array<IModuleTupleRecursive<Module>> {}

export interface WindowWithStore extends Window {
  [STOREKEY]: IModuleStoreWithSagaTasks
}

export interface WrapperProps {
  initialProps: any // stuff returned from getInitialProps
  initialState: any // stuff in the Store state after getInitialProps
}

export type NextPageWithStore<P = {}, IP = {}, S = any> = NextComponentType<
  NextPageContext & { store: IModuleStoreWithSagaTasks<S> },
  IP,
  P
>

export type NextPageWithModules<P = {}, IP = {}, S = any, R extends Action = any> = NextPageWithStore<P, IP, S> & {
  modules: ISagaModule<S, R>[]
}

export type AppContextWithModules = AppContext & { Component: NextPageWithModules }

export interface GetStoreParams {
  rootModules?: IModuleTuple
  pageModules?: IModuleTuple
  context?: AppContextWithModules
}
