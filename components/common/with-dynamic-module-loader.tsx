import type { NextPage } from 'next'
import { useCallback, useRef } from 'react'
import { useStore } from 'react-redux'
import { flatten } from 'redux-dynamic-modules-core/lib/Utils/Flatten'

import type { ModuleTuple, NextPageWithModules } from '@/store/contracts'
import type { ModuleStoreWithSagaTasks, SagaModule } from '@/store/saga-extension/contracts'

import { AddedModulesCleanup } from './added-modules-cleanup'

export const withDynamicModuleLoader = (
  Component: NextPage<any>,
  modules: ModuleTuple<any> = [],
): NextPageWithModules => {
  let modulesToBeAdded: SagaModule[] = []

  const Wrapper: NextPageWithModules = props => {
    const store = useStore() as ModuleStoreWithSagaTasks

    const isFirstRender = useRef(true)

    if (isFirstRender.current) {
      isFirstRender.current = false

      if (!modulesToBeAdded.length) {
        modulesToBeAdded = flatten(modules)
      }
    }

    const cleanup = useCallback(() => {
      store.removeModules(modulesToBeAdded)
      modulesToBeAdded = []
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

  Wrapper.getInitialProps = async context => {
    if (!modulesToBeAdded.length) {
      modulesToBeAdded = flatten(modules)
      context.store.addModules(modulesToBeAdded)
    }

    return Component.getInitialProps?.(context) || {}
  }

  return Wrapper
}
