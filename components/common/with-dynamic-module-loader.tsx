import { NextPage } from 'next'
import React, { useCallback } from 'react'
import { useStore } from 'react-redux'

import { ModuleTuple, NextPageWithModules } from '../../store/contracts'
import { ModuleStoreWithSagaTasks } from '../../store/saga-extension/contracts'
import { AddedModulesCleanup } from './dynamic-module-loader'

export const withDynamicModuleLoader = (
  Component: NextPage<any>,
  modules: ModuleTuple<any> = [],
): NextPageWithModules => {
  const Wrapper: NextPageWithModules = props => {
    const store = useStore() as ModuleStoreWithSagaTasks

    const cleanup = useCallback(() => {
      store.removeModules(modules)
    }, [store])

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
