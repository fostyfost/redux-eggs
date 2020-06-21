import React from 'react'
import { NextPage } from 'next'
import { DynamicModuleLoader } from './dynamic-module-loader'
import { IModuleTuple, NextPageWithModules } from '../../store/contracts'

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
    Wrapper.getInitialProps = async context => {
      context.store.addModules(modules)
      return Component.getInitialProps?.(context)
    }
  }

  return Wrapper
}
