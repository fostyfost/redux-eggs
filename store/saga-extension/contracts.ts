import { IModule, IExtension, IMap, IItemManager, IModuleStore } from 'redux-dynamic-modules'
import { Task } from 'redux-saga'
import { Action, AnyAction, ReducersMapObject } from 'redux'

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

export type IModuleStoreWithSagaTasks<State = {}> = IModuleStore<State> & {
  sagaTasks: IMap<ISagaRegistration, Task>
}
