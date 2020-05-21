import { STOREKEY } from './index'
import { IModuleStoreWithSagaTasks } from './saga-extension/contracts'
import { AppContext } from 'next/app'
import { NextPageContext } from 'next'
import { NextPageWithModules } from '../contracts'

export interface WindowWithStore extends Window {
  [STOREKEY]: IModuleStoreWithSagaTasks
}

export interface WrapperProps {
  initialProps: any // stuff returned from getInitialProps
  initialState: any // stuff in the Store state after getInitialProps
  pageProps?: any // stuff from page's getServerSideProps or getInitialProps when used with App
}

export interface MakePropsParams {
  getInitialProps: (
    context: AppContext & { ctx: NextPageContext & { store: IModuleStoreWithSagaTasks } },
  ) => Promise<WrapperProps>
  context: AppContext & { Component: NextPageWithModules }
}
