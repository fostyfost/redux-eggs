import type { Extension } from '@redux-eggs/core'
import type { ThunkMiddleware } from 'redux-thunk'
import thunk from 'redux-thunk'

export const getThunkExtension = (): Extension<ThunkMiddleware> => {
  return {
    middleware: thunk,
  }
}
