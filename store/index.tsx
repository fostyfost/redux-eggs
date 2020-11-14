import { AppInitialProps, AppType } from 'next/dist/next-server/lib/utils'
import { useRef, useState } from 'react'
import { Provider } from 'react-redux'
import { END } from 'redux-saga'

import { StoreAction } from '@/store/action-creators'
import { allSagasDone } from '@/store/all-sagas-done'
import { AppContextWithModules, ModuleTuple, WrapperProps } from '@/store/contracts'
import { getStore } from '@/store/store-initializer'

interface InitialProps extends AppInitialProps {
  [props: string]: any
}

export const withRedux = (App: AppType, rootModules: ModuleTuple<any>) => {
  const makeProps = async (
    context: AppContextWithModules,
    appProps: AppInitialProps & { [key: string]: any },
  ): Promise<WrapperProps> => {
    const initialStore = getStore({
      rootModules,
      pageModules: context.Component.modules,
      context,
    })

    if (context.Component.getInitialProps) {
      const pageProps = await context.Component.getInitialProps({ ...context.ctx, store: initialStore })
      if (pageProps) {
        appProps.pageProps = { ...appProps.pageProps, ...pageProps }
      }
    }

    if (context.ctx?.req) {
      // Кидаем этот экшен, чтобы остановить всех подписчиков на каналы,
      // иначе процессы будут видеть вечно, такая сага должна быть подписана на этот экшен
      initialStore.dispatch(StoreAction.stopAllTasks())
      // Затем сообщаем сагам, что они должны завершить свою работу
      initialStore.dispatch(END)
      // Дожидаемся, когда все саги завершат свою работу
      await allSagasDone(initialStore.sagaTasks.keys.map(key => initialStore.sagaTasks.get(key)))
    }

    return {
      initialProps: appProps,
      initialState: initialStore.getState(),
      getInitialSsrStore: () => initialStore,
    }
  }

  const Wrapper = ({
    initialState,
    initialProps,
    getInitialSsrStore,
    Component,
    ...props
  }: WrapperProps & AppContextWithModules) => {
    const isFirstRender = useRef(true)

    // see https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
    const [store] = useState(() => {
      if (typeof window === 'undefined' && typeof getInitialSsrStore === 'function') {
        return getInitialSsrStore()
      }

      return getStore({ rootModules, pageModules: Component.modules, initialState })
    })

    if (isFirstRender.current) {
      isFirstRender.current = false

      if (initialState) {
        store.dispatch(StoreAction.hydrate(initialState))
      }
    }

    return (
      <Provider store={store}>
        <App {...initialProps} {...props} Component={Component} />
      </Provider>
    )
  }

  Wrapper.displayName = 'withRedux(WrappedApp)'

  Wrapper.getInitialProps = async (context: AppContextWithModules): Promise<WrapperProps> => {
    let appProps: InitialProps = { pageProps: {} }

    if (App.getInitialProps) {
      appProps = await App.getInitialProps(context)

      if (!appProps.pageProps) {
        appProps.pageProps = { pageProps: {} }
      }
    }

    return makeProps(context, appProps)
  }

  return Wrapper
}
