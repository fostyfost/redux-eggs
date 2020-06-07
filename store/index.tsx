import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Provider } from 'react-redux'
import { END } from 'redux-saga'
import { allSagasDone } from './all-sagas-done'
import { getStore } from './store-initializer'
import { hydrateAction } from './hydrate-action'
import { AppContextWithModules, WrapperProps } from './contracts'
import { IModuleStoreWithSagaTasks, ISagaModule } from './saga-extension/contracts'
import { AppPropsType } from 'next/dist/next-server/lib/utils'

export const STOREKEY = '__NEXT_REDUX_WRAPPER_STORE__' as const

export const withRedux = (App: FC<AppPropsType>, rootModules: ISagaModule[]) => {
  let initialStore: IModuleStoreWithSagaTasks

  const makeProps = async (context: AppContextWithModules): Promise<WrapperProps> => {
    initialStore = getStore({
      rootModules,
      pageModules: context.Component.modules,
      context,
    })

    const initialProps: { pageProps: any; [props: string]: any } = { pageProps: {} }

    if (context.Component.getInitialProps) {
      initialProps.pageProps = await context.Component.getInitialProps({ ...context.ctx, store: initialStore })
    }

    if (context.ctx?.req) {
      initialStore.dispatch(END)
      await allSagasDone(initialStore.sagaTasks.keys.map(key => initialStore.sagaTasks.get(key)))
    }

    return {
      initialProps,
      initialState: initialStore.getState(),
    }
  }

  const Wrapper = ({ initialState, initialProps, Component, ...props }: WrapperProps & AppContextWithModules) => {
    const isFirstRender = useRef(true)

    // see https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
    const [store] = useState(() => {
      if (typeof window === 'undefined' && initialStore) {
        return initialStore
      }

      return getStore({ rootModules, pageModules: Component.modules })
    })

    const hydrate = useCallback(() => {
      store.dispatch(hydrateAction(initialState))
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
      <Provider store={store}>
        <App {...initialProps} {...props} Component={Component} />
      </Provider>
    )
  }

  Wrapper.displayName = 'withRedux(WrappedApp)'

  Wrapper.getInitialProps = async (context: AppContextWithModules): Promise<WrapperProps> => {
    return await makeProps(context)
  }

  return Wrapper
}
