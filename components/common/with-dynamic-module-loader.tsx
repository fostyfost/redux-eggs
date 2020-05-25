import React from 'react'
import { NextPage } from 'next'
import { DynamicModuleLoader, IModuleTuple } from './dynamic-module-loader'
import { NextPageWithModules } from '../../store/contracts'

export const withDynamicModuleLoader = (
  Component: NextPage<any>,
  modules: IModuleTuple<any> = [],
): NextPageWithModules => {
  const Wrapper: NextPageWithModules = props => {
    return (
      <DynamicModuleLoader modules={modules}>
        <Component {...props} />
      </DynamicModuleLoader>
    )
  }

  Wrapper.modules = modules

  Wrapper.displayName = `withDynamicModuleLoader(${Component.displayName || 'Component'})`

  if (Component.getInitialProps) {
    Wrapper.getInitialProps = Component.getInitialProps
  }

  return Wrapper
}
