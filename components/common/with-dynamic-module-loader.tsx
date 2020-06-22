import { NextPage } from 'next'
import React, { useCallback } from 'react'

import { IModuleTuple, NextPageWithModules } from '../../store/contracts'
import { AddedModulesCleanup } from './dynamic-module-loader'
import { useStore } from 'react-redux'
import { IModuleStoreWithSagaTasks } from '../../store/saga-extension/contracts'

export const withDynamicModuleLoader = (
  Component: NextPage<any>,
  modules: IModuleTuple<any> = [],
): NextPageWithModules => {
  const Wrapper: NextPageWithModules = props => {
    const store = useStore() as IModuleStoreWithSagaTasks

    const cleanup = useCallback(() => {
      store.removeModules(modules)
    }, [])

    return (
      <>
        <Component {...props} />
        <AddedModulesCleanup cleanup={cleanup} />
      </>
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
