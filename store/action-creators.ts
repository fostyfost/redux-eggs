import { ActionsUnion, createAction } from '@/store/action-helper'
import { StoreActionType } from '@/store/action-types'

export const StoreAction = {
  hydrate: (payload: { [moduleId: string]: any }) => createAction(StoreActionType.HYDRATE, payload),
  stopAllTasks: () => createAction(StoreActionType.STOP_ALL_TASKS),
}

export type StoreActionsUnion = ActionsUnion<typeof StoreAction>
