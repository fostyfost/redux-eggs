import React, { FC, ReactNode, useCallback, useEffect } from 'react'
import { useStore } from 'react-redux'

import { IModuleTuple } from '../../store/contracts'
import { IModuleStoreWithSagaTasks, ISagaModule } from '../../store/saga-extension/contracts'

const renderLoader = (children: ReactNode): ReactNode => {
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
export const AddedModulesCleanup: FC<{ cleanup: () => void }> = ({ cleanup }) => {
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  return null
}

export const DynamicModuleLoader: FC<{
  modules: ISagaModule[] | IModuleTuple<any>
  children: ReactNode
}> = ({ modules, children }) => {
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
