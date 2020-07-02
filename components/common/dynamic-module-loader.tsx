import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react'
import { useStore } from 'react-redux'

import { ModuleTuple } from '../../store/contracts'
import { ModuleStoreWithSagaTasks, SagaModule } from '../../store/saga-extension/contracts'

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
  modules: SagaModule[] | ModuleTuple<any>
  children: ReactNode
}> = ({ modules, children }) => {
  const store = useStore() as ModuleStoreWithSagaTasks

  const [addedModulesRemover] = useState(() => store.addModules(modules))

  const cleanup = useCallback(() => {
    addedModulesRemover.remove()
  }, [addedModulesRemover])

  return (
    <>
      {renderLoader(children)}
      <AddedModulesCleanup cleanup={cleanup} />
    </>
  )
}
