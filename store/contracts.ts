import { NextComponentType, NextPageContext } from 'next'
import { AppContext } from 'next/app'
import { Action } from 'redux'
import { STOREKEY } from './index'
import { IModuleStoreWithSagaTasks, ISagaModule } from './saga-extension/contracts'

export interface WindowWithStore extends Window {
  [STOREKEY]: IModuleStoreWithSagaTasks
}

export interface WrapperProps {
  initialProps: any // stuff returned from getInitialProps
  initialState: any // stuff in the Store state after getInitialProps
}

export type NextPageWithModules<P = {}, IP = {}, S = any, R extends Action = any> = NextComponentType<
  NextPageContext & { store: IModuleStoreWithSagaTasks },
  IP,
  P
> & { modules: ISagaModule<S, R>[] }

export type AppContextWithModules = AppContext & { Component: NextPageWithModules }

export interface GetStoreParams {
  rootModules?: ISagaModule[]
  pageModules?: ISagaModule[]
  context?: AppContextWithModules
}
