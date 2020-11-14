import { Action, AnyAction, ReducersMapObject } from 'redux'
import { IExtension, IItemManager, IMap, IModule } from 'redux-dynamic-modules-core'
import { Task } from 'redux-saga'

import { AdvancedModuleStore } from '@/store/create-store'

export interface SagaWithArguments<T = any> {
  saga: (argument?: T) => Iterator<any>
  argument?: T
}

export type SagaRegistration<T = any> = (() => Iterator<any>) | SagaWithArguments<T>

export interface SagaModule<State = any, ReducerAction extends Action = AnyAction>
  extends Omit<IModule<State>, 'reducerMap'> {
  sagas?: SagaRegistration[]
  reducerMap?: ReducersMapObject<State, ReducerAction>
}

export interface SagaExtension<T = any> extends IExtension {
  sagaTasks: IMap<SagaRegistration<T>, Task>
}

export interface SagaManager extends IItemManager<SagaRegistration> {
  sagaTasks: IMap<SagaRegistration, Task>
}

export type ModuleStoreWithSagaTasks<State = Record<string, unknown>> = AdvancedModuleStore<State> & {
  sagaTasks: IMap<SagaRegistration, Task>
}

export type SagaContext = { [filed: string]: any }
