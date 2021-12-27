import type { Extension } from '@redux-eggs/core/dist'
import thunk from 'redux-thunk'

export const getThunkExtension = (): Extension<any> => {
  return {
    middlewares: [thunk],
  }
}
