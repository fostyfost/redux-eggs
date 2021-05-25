import type { EggTuple } from '@redux-eggs/core'
import type { NextPage, NextPageContext } from 'next'
import type { AppContext, AppProps } from 'next/app'
import React from 'react'
import { Provider } from 'react-redux'

import { HYDRATE_ACTION_TYPE } from '@/action-types'
import type {
  AnyStore,
  AppWrapperOptions,
  BeforeResult,
  PageWrapper,
  WrapperInitializerOptions,
  WrapperInitializerResults,
} from '@/contracts'
import type { EggsConfig } from '@/contracts-internal'

export * from '@/action-types'

export const createWrapperInitializer = <S extends AnyStore = AnyStore>(
  storeCreator: () => S,
  options: WrapperInitializerOptions = {},
): WrapperInitializerResults<S> => {
  let anyStore: S
  let appEggsLocal: EggTuple = []
  let appHasGetInitialProps = false
  let beforeResult: BeforeResult<S> | undefined
  let prevPage: (NextPage & EggsConfig) | undefined
  let prevState: any | undefined

  const runBeforeResult = async (context: any): Promise<void> => {
    if (beforeResult) {
      await beforeResult(anyStore, { context })
    }
  }

  const add = (nextPage: NextPage & EggsConfig): void => {
    if (nextPage !== prevPage) {
      const pageEggs = nextPage.__eggs || []

      anyStore.addEggs(prevPage ? pageEggs : ([] as EggTuple).concat(appEggsLocal, pageEggs))

      prevPage = nextPage
    }
  }

  const hydrate = (payload?: any): void => {
    if (prevState !== payload) {
      if (payload) {
        anyStore.dispatch({ type: options.hydrationActionType || HYDRATE_ACTION_TYPE, payload })
      }

      prevState = payload
    }
  }

  return {
    getAppWrapper(appEggs: EggTuple = [], options: AppWrapperOptions<S> = {}) {
      appEggsLocal = appEggs

      beforeResult = options.beforeResult

      return {
        wrapGetInitialProps(fn): any {
          appHasGetInitialProps = true

          return async (context: AppContext) => {
            add(context.Component)

            const appProps = await fn(anyStore)(context)

            await runBeforeResult(context)

            return appProps
          }
        },

        wrapApp(AppComponent: any): any {
          return class WrappedApp extends React.Component<AppProps> {
            static getInitialProps = AppComponent.getInitialProps

            constructor(props: AppProps & { [key: string]: any }) {
              super(props)

              if (!anyStore) {
                anyStore = storeCreator()
              }

              add(props.Component)

              hydrate(props.pageProps.__eggsState)
            }

            shouldComponentUpdate = (nextProps: Readonly<AppProps>): boolean => {
              add(nextProps.Component)

              if (!nextProps.Component.getInitialProps) {
                hydrate(nextProps.pageProps.__eggsState)
              }

              return true
            }

            render = (): JSX.Element => {
              delete this.props.pageProps.__eggsState

              return (
                <Provider store={anyStore as any}>
                  <AppComponent {...this.props} />
                </Provider>
              )
            }

            componentDidUpdate = (prevProps: Readonly<AppProps>): void => {
              const prevComponent: NextPage & EggsConfig = prevProps.Component

              if (prevComponent.__eggs?.length && this.props.Component !== prevComponent) {
                anyStore.removeEggs(prevComponent.__eggs)
              }
            }
          }
        },
      }
    },

    getPageWrapper(pageEggs: EggTuple = []): PageWrapper<S> {
      let currentPage: NextPage & EggsConfig

      return {
        wrapGetInitialProps(fnOrProps?: any): any {
          const localFn = typeof fnOrProps === 'function' ? fnOrProps : () => () => ({ ...fnOrProps })

          return async (context: NextPageContext) => {
            if (!appHasGetInitialProps) {
              add(currentPage)
            }

            const pageProps = await localFn(anyStore)(context)

            if (!appHasGetInitialProps) {
              await runBeforeResult(context)
            }

            return pageProps
          }
        },

        wrapPage<T extends NextPage<any, any> = NextPage>(page: T): T {
          currentPage = page
          currentPage.__eggs = pageEggs

          return page
        },
      } as PageWrapper<S>
    },
  }
}
