import {
  applyMiddleware,
  compose,
  createStore as createReduxStore,
  DeepPartial,
  PreloadedState,
  Reducer,
  ReducersMapObject,
  StoreEnhancer,
} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import {
  getMiddlewareManager,
  getRefCountedManager,
  IExtension,
  IModule,
  IModuleStore,
} from 'redux-dynamic-modules-core'
import { getModuleManager } from 'redux-dynamic-modules-core/lib/Managers/ModuleManager'
import { flatten } from 'redux-dynamic-modules-core/lib/Utils/Flatten'

import { ModuleTuple } from './contracts'

type ModuleStoreSettings<S> = {
  initialState?: DeepPartial<S>
  enhancers?: StoreEnhancer[]
  extensions?: IExtension[]
  advancedComposeEnhancers?: typeof compose
  advancedCombineReducers?: (reducers: ReducersMapObject<S, any>) => Reducer<S>
}

export interface AdvancedModuleStore<State> extends IModuleStore<State> {
  removeModule: (moduleToBeRemoved: IModule<any>) => void
  removeModules: (moduleToBeRemoved: ModuleTuple) => void
  getAddedModules: () => string[]
}

export function createStore<State>(
  moduleStoreSettings: ModuleStoreSettings<State>,
  initialModules: ModuleTuple,
): AdvancedModuleStore<State> {
  const {
    initialState = {},
    extensions = [],
    enhancers = [],
    advancedComposeEnhancers = composeWithDevTools({}),
    advancedCombineReducers,
  } = moduleStoreSettings

  const extensionMiddleware = extensions.reduce((acc: any[], ext: IExtension) => {
    if (ext.middleware) {
      acc.push(...ext.middleware)
    }

    return acc
  }, [])

  const middlewareManager = getRefCountedManager<any, any>(getMiddlewareManager(), (a, b) => a === b)

  const enhancer = advancedComposeEnhancers(
    ...enhancers,
    applyMiddleware(...extensionMiddleware, middlewareManager.enhancer),
  )

  const moduleManager = getRefCountedManager(
    getModuleManager<State>(middlewareManager, extensions, advancedCombineReducers),
    (a: IModule<any>, b: IModule<any>) => a.id === b.id,
    a => !!a.retained,
  )

  // Create store
  const store = createReduxStore<State, any, {}, {}>(
    moduleManager.getReducer as Reducer<State, any>,
    initialState as PreloadedState<State>,
    enhancer as any,
  ) as AdvancedModuleStore<State>

  moduleManager.setDispatch(store.dispatch)

  const addedModulesIds = new Set<string>()

  const _removeModules = (modules: IModule<any>[]) => {
    modules.forEach(module => {
      if (!module.retained) {
        addedModulesIds.delete(module.id)
      }
    })

    moduleManager.remove(modules)
  }

  const addModules = (modulesToBeAdded: ModuleTuple) => {
    const flattenedModules = flatten(modulesToBeAdded)

    flattenedModules.forEach(module => {
      addedModulesIds.add(module.id)
    })

    moduleManager.add(flattenedModules)

    return {
      remove: () => {
        _removeModules(flattenedModules)
      },
    }
  }

  const addModule = (moduleToBeAdded: IModule<any>) => addModules([moduleToBeAdded])

  const removeModules = (modulesToBeRemoved: ModuleTuple) => {
    _removeModules(flatten(modulesToBeRemoved) as IModule<any>[])
  }

  const removeModule = (moduleToBeRemoved: IModule<any>) => {
    removeModules([moduleToBeRemoved])
  }

  extensions.forEach(ext => {
    if (ext.onModuleManagerCreated) {
      ext.onModuleManagerCreated({
        addModule,
        addModules,
      })
    }
  })

  store.addModule = addModule
  store.addModules = addModules

  store.removeModule = removeModule
  store.removeModules = removeModules

  store.dispose = () => {
    // get all added modules and remove them
    moduleManager.dispose()
    middlewareManager.dispose()
    extensions.forEach(ext => {
      if (ext.dispose) {
        ext.dispose()
      }
    })
  }

  store.getAddedModules = (): string[] => {
    return Array.from(addedModulesIds)
  }

  const modules = flatten(initialModules).map(module => {
    const moduleCopy = { ...module }

    addedModulesIds.add(module.id)

    if (typeof window !== 'undefined') {
      moduleCopy.initialActions = []
    }

    return moduleCopy
  })

  moduleManager.add(modules)

  return store
}
