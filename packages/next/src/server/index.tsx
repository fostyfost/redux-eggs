import type { EggTuple } from '@redux-eggs/core'
import type { GetStaticPathsContext, NextPage, NextPageContext } from 'next'
import type { AppContext, AppProps } from 'next/app'
import React from 'react'
import { Provider } from 'react-redux'

import type { AnyStore, AppWrapperOptions, BeforeResult, PageWrapper, WrapperInitializerResults } from '@/contracts'
import type { WrapperInitializerOptions } from '@/contracts'
import type { EggsConfig, EggsConfigValue } from '@/contracts-internal'

export * from '@/action-types'
export * from '@/contracts'

export function createWrapperInitializer<S extends AnyStore = AnyStore>(
  storeCreator: () => S,
  options?: WrapperInitializerOptions,
): WrapperInitializerResults<S>

export function createWrapperInitializer<S extends AnyStore = AnyStore>(
  storeCreator: () => S,
): WrapperInitializerResults<S> {
  let anyStore: S
  let appEggsLocal: EggTuple = []
  let appHasGetInitialProps = false
  let beforeResult: BeforeResult<S> | undefined

  const getStore = (eggs: EggTuple = []): S => {
    anyStore = storeCreator()
    anyStore.addEggs(eggs)

    return anyStore
  }

  const withAppEggs = (pageEggs: EggTuple = []): EggTuple => {
    return ([] as EggTuple).concat(appEggsLocal, pageEggs)
  }

  const getLocalFn = (fnOrProps: any = {}, isGetInitialProps = false) => {
    if (typeof fnOrProps === 'function') {
      return fnOrProps
    }

    const props = { ...fnOrProps }

    return () => () => isGetInitialProps ? props : { props }
  }

  const runBeforeResult = async (store: S, context: any): Promise<void> => {
    if (beforeResult) {
      await beforeResult(store, { context })
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
            const page = context.Component as EggsConfig

            const store = getStore(withAppEggs(page.__eggs))

            const appProps = await fn(store)(context)

            if (!page.__eggsConfig?.gspOrGsspDetected) {
              await runBeforeResult(store, context)
            }

            appProps.pageProps = {
              ...appProps.pageProps,
              __eggsState: store.getState(),
            }

            return appProps
          }
        },

        wrapApp(AppComponent: any): any {
          return class WrappedApp extends React.Component<AppProps> {
            private store = anyStore || getStore()

            static getInitialProps = AppComponent.getInitialProps

            render = (): JSX.Element => {
              return (
                <Provider store={this.store as any}>
                  <AppComponent {...this.props} />
                </Provider>
              )
            }
          }
        },
      }
    },

    getPageWrapper(pageEggs: EggTuple = []): PageWrapper<S> {
      const eggsConfigValue: EggsConfigValue = {}

      const wrap = (fnOrProps?: any) => {
        eggsConfigValue.gspOrGsspDetected = true

        const localFn = getLocalFn(fnOrProps)

        return async (context: any): Promise<any> => {
          let store = anyStore

          if (!appHasGetInitialProps) {
            store = getStore(withAppEggs(pageEggs))
          }

          const result = await localFn(store)(context)

          await runBeforeResult(store, context)

          if ('props' in result) {
            return {
              ...result,
              props: {
                ...result.props,
                __eggsState: store.getState(),
              },
            }
          }

          return result
        }
      }

      return {
        wrapGetInitialProps(fnOrProps?: any): any {
          const localFn = getLocalFn(fnOrProps, true)

          return async (context: NextPageContext) => {
            let store = anyStore

            if (!appHasGetInitialProps) {
              store = getStore(withAppEggs(pageEggs))
            }

            const pageProps = await localFn(store)(context)

            if (!appHasGetInitialProps) {
              await runBeforeResult(store, context)
            }

            return {
              ...pageProps,
              __eggsState: store.getState(),
            }
          }
        },

        wrapGetStaticPaths(fn) {
          return async (context: GetStaticPathsContext): Promise<any> => {
            const store = storeCreator()

            const result = await fn(store)(context)

            await runBeforeResult(store, context)

            return result
          }
        },

        wrapGetStaticProps: wrap as PageWrapper<S>['wrapGetStaticProps'],

        wrapGetServerSideProps: wrap as PageWrapper<S>['wrapGetServerSideProps'],

        // TODO: Add error for unwrapped GSP or GSSP pages
        wrapPage<T extends NextPage<any, any> = NextPage>(page: T): T {
          const eggsConfig: EggsConfig = {
            __eggs: pageEggs,
            __eggsConfig: eggsConfigValue,
          }

          return Object.assign(page, eggsConfig)
        },
      }
    },
  }
}
