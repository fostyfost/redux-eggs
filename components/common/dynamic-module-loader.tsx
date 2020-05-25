import React, { ReactNode, useCallback, useEffect } from 'react'
import { useStore } from 'react-redux'
import { IModule } from 'redux-dynamic-modules-core'
import { IModuleStoreWithSagaTasks, ISagaModule } from '../../store/saga-extension/contracts'

type IModuleTupleRecursive<Module extends IModule<any> = IModule<any>> = Module | IModuleTuple

export interface IModuleTuple<Module extends IModule<any> = IModule<any>>
  extends Array<IModuleTupleRecursive<Module>> {}

const renderLoader = (children: ReactNode): React.ReactNode => {
  if (children) {
    if (typeof children === 'function') {
      return children()
    }

    return children
  }

  return null
}

/**
 * This component is rendered as the last child of `DynamicModuleLoader`
 * so react runs willUnmount on connected(react-redux) children before this
 * cleanup and allows them to unsubscribe from store before dynamic reducers
 * removing (and avoid errors in selectors)
 */
export const AddedModulesCleanup = ({ cleanup }: { cleanup: () => void }) => {
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  return null
}

export function DynamicModuleLoader({
  modules,
  children,
}: {
  modules: ISagaModule[] | IModuleTuple<any>
  children: ReactNode
}) {
  const store = useStore() as IModuleStoreWithSagaTasks

  store.addModules(modules)

  const cleanup = useCallback(() => {
    store.removeModules(modules)
  }, [])

  return (
    <>
      {renderLoader(children)}
      <AddedModulesCleanup cleanup={cleanup} />
    </>
  )
}
