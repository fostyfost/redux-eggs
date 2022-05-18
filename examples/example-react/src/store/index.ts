import { createStore } from '@redux-eggs/redux'
import { useDispatch } from 'react-redux'
import type { AnyAction } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import type { ThunkAction } from 'redux-thunk'

import { getCommonEggs } from './eggs/common'
import { getLoggerExtension } from './logger-extension'
import { getThunkExtension } from './thunk-extension'

export type AppStore = typeof store

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, any, unknown, AnyAction>

export const useAppDispatch = () => useDispatch<AppDispatch>()

const store = createStore({
  extensions: [getThunkExtension(), getLoggerExtension()],
  enhancersComposer: composeWithDevTools({ maxAge: 200 }),
})

store.addEggs(getCommonEggs())

export { store }
