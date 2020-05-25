import { IModule, IExtension, IMap, IItemManager } from 'redux-dynamic-modules-core'
import { Task } from 'redux-saga'
import { Action, AnyAction, ReducersMapObject } from 'redux'
import { AdvancedModuleStore } from '../create-store'

export interface ISagaWithArguments<T = any> {
  saga: (argument?: T) => Iterator<any>
  argument?: T
}

export type ISagaRegistration<T = any> = (() => Iterator<any>) | ISagaWithArguments<T>

export interface ISagaModule<State = any, ReducerAction extends Action = AnyAction>
  extends Omit<IModule<State>, 'reducerMap'> {
  sagas?: ISagaRegistration[]
  reducerMap?: ReducersMapObject<State, ReducerAction>
}

export interface ISagaExtension<T = any> extends IExtension {
  sagaTasks: IMap<ISagaRegistration<T>, Task>
}

export interface ISagaManager extends IItemManager<ISagaRegistration> {
  sagaTasks: IMap<ISagaRegistration, Task>
}

export type IModuleStoreWithSagaTasks<State = {}> = AdvancedModuleStore<State> & {
  sagaTasks: IMap<ISagaRegistration, Task>
}
