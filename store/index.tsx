import React, { useCallback, useEffect, useRef } from 'react'
import App, { AppContext } from 'next/app'
import { Provider } from 'react-redux'
import { END } from 'redux-saga'
import { allSagasDone } from './all-sagas-done'
import { initStore } from './store-initializer'
import { hydrateAction } from './hydrate-action'
import { NextComponentType } from 'next'
import { MakePropsParams, WrapperProps } from './contracts'
import { NextPageWithModules } from '../contracts'

export const STOREKEY = '__NEXT_REDUX_WRAPPER_STORE__' as const

const makeProps = async ({ getInitialProps, context }: MakePropsParams): Promise<WrapperProps> => {
  const store = initStore(context.Component.modules)

  const initialProps = await getInitialProps({
    ...context,
    ctx: { ...context.ctx, store },
  })

  if (context.ctx?.req) {
    store.dispatch(END)
    await allSagasDone(store.sagaTasks.keys.map(key => store.sagaTasks.get(key)))
  }

  const state = store.getState()

  return {
    initialProps,
    initialState: state,
  }
}

export const withRedux = (Application: NextComponentType | App | any) => {
  const Wrapper = ({
    initialState,
    initialProps,
    Component,
    ...props
  }: WrapperProps & AppContext & { Component: NextPageWithModules }) => {
    const isFirstRender = useRef(true)

    const store = useRef(initStore(Component.modules))

    const hydrate = useCallback(() => {
      store.current.dispatch(hydrateAction(initialState))
    }, [initialState])

    // apply synchronously on first render (both server side and client side)
    if (isFirstRender.current) {
      hydrate()
    }

    // apply async in case props have changed, on navigation for example
    useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false
        return
      }

      hydrate()
    }, [hydrate])

    if (initialProps && initialProps.pageProps) {
      props.pageProps = {
        ...initialProps.pageProps,
        ...props.pageProps,
      }
    }

    return (
      <Provider store={store.current}>
        <Application {...initialProps} {...props} Component={Component} />
      </Provider>
    )
  }

  Wrapper.displayName = 'withRedux(WrappedApp)'

  Wrapper.getInitialProps = async (context: AppContext): Promise<WrapperProps> => {
    return await makeProps({
      getInitialProps: Application.getInitialProps,
      context,
    })
  }

  return Wrapper
}
