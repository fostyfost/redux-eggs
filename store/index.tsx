import React, { useCallback, useEffect, useRef } from 'react'
import App, { AppContext } from 'next/app'
import { Provider } from 'react-redux'
import { END } from 'redux-saga'
import { allSagasDone } from './all-sagas-done'
import { getStore } from './store-initializer'
import { hydrateAction } from './hydrate-action'
import { NextComponentType, NextPage } from 'next'
import { AppContextWithModules, MakePropsParams, NextPageWithModules, WrapperProps } from './contracts'
import { ISagaModule } from './saga-extension/contracts'

export const STOREKEY = '__NEXT_REDUX_WRAPPER_STORE__' as const

const makeProps = async ({ initialModules, context }: MakePropsParams): Promise<WrapperProps> => {
  const componentModules = Array.isArray(context.Component.modules) ? context.Component.modules : []
  const allInitialModules: ISagaModule[] = initialModules.concat(componentModules)

  const store = getStore(allInitialModules)

  const initialProps: { pageProps: any; [props: string]: any } = { pageProps: {} }

  if (context.Component.getInitialProps) {
    initialProps.pageProps = await context.Component.getInitialProps({ ...context.ctx, store })
  }

  if (context.ctx?.req) {
    store.dispatch(END)
    await allSagasDone(store.sagaTasks.keys.map(key => store.sagaTasks.get(key)))
  }

  return {
    initialProps,
    initialState: store.getState(),
  }
}

export const withRedux = (Application: NextComponentType | App | any) => {
  const Wrapper = ({
    initialState,
    initialProps,
    Component,
    ...props
  }: WrapperProps & AppContext & { Component: NextPage | NextPageWithModules }) => {
    const isFirstRender = useRef(true)

    const componentModules = useRef('modules' in Component ? Component.modules : [])
    const allInitialModules: ISagaModule[] = Application.initialModules.concat(componentModules.current)

    const store = useRef(getStore(allInitialModules))

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

    return (
      <Provider store={store.current}>
        <Application {...initialProps} {...props} Component={Component} />
      </Provider>
    )
  }

  Wrapper.displayName = 'withRedux(WrappedApp)'

  Wrapper.getInitialProps = async (context: AppContextWithModules): Promise<WrapperProps> => {
    return await makeProps({
      initialModules: Application.initialModules,
      context,
    })
  }

  return Wrapper
}
