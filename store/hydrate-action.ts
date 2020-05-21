import { createAction } from './action-helper'

export const HYDRATE = '__NEXT_REDUX_WRAPPER_HYDRATE__' as const

export const hydrateAction = (state: { [moduleId: string]: any }) => createAction(HYDRATE, state)

export type HydrateAction = ReturnType<typeof hydrateAction>
