/* eslint-disable @typescript-eslint/no-explicit-any,react/prop-types */
import React, { Component, FC, ReactNode, useEffect } from 'react'
import { useStore } from 'react-redux'
import { IDynamicallyAddedModule } from 'redux-dynamic-modules-core'
import { ModuleStoreWithSagaTasks, SagaModule } from '../../store/saga-extension/contracts'
import { ModuleTuple } from '../../store/contracts'

interface AddedModulesCleanupProps {
  cleanup: () => void
}

interface DynamicModuleLoaderProps {
  modules: SagaModule[] | ModuleTuple<any>
}

interface DynamicModuleLoaderClassProps extends DynamicModuleLoaderProps {
  store: ModuleStoreWithSagaTasks
}

/**
 * This component is rendered as the last child of `DynamicModuleLoader`
 * so react runs willUnmount on connected(react-redux) children before this
 * cleanup and allows them to unsubscribe from store before dynamic reducers
 * removing (and avoid errors in selectors)
 */
export const AddedModulesCleanup: FC<AddedModulesCleanupProps> = ({ cleanup }) => {
  useEffect(() => {
    return (): void => {
      cleanup()
    }
  }, [cleanup])

  return null
}

export const DynamicModuleLoader: FC<DynamicModuleLoaderProps> = props => {
  const store = useStore() as ModuleStoreWithSagaTasks

  return <DynamicModuleLoaderClass {...props} store={store} />
}

class DynamicModuleLoaderClass extends Component<DynamicModuleLoaderClassProps> {
  private addedModules?: IDynamicallyAddedModule

  constructor(props: Readonly<DynamicModuleLoaderClassProps>) {
    super(props)

    this.addModules()
  }

  private cleanup = (): void => {
    if (this.addedModules) {
      this.addedModules.remove()
      this.addedModules = undefined
    }
  }

  private addModules(): void {
    const { store, modules } = this.props

    this.addedModules = store.addModules(modules)
  }

  public render(): ReactNode {
    const { children } = this.props

    return (
      <>
        {children}
        <AddedModulesCleanup cleanup={this.cleanup} />
      </>
    )
  }
}
