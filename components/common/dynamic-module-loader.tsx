import { Component, FC, ReactNode } from 'react'
import { useStore } from 'react-redux'
import { IDynamicallyAddedModule } from 'redux-dynamic-modules-core'

import { ModuleTuple } from '@/store/contracts'
import { ModuleStoreWithSagaTasks, SagaModule } from '@/store/saga-extension/contracts'

import { AddedModulesCleanup } from './added-modules-cleanup'

interface DynamicModuleLoaderProps {
  modules: SagaModule[] | ModuleTuple<any>
}

interface DynamicModuleLoaderClassProps extends DynamicModuleLoaderProps {
  store: ModuleStoreWithSagaTasks
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

const DynamicModuleLoader: FC<DynamicModuleLoaderProps> = props => {
  const store = useStore() as ModuleStoreWithSagaTasks

  return <DynamicModuleLoaderClass {...props} store={store} />
}

export { DynamicModuleLoader }
