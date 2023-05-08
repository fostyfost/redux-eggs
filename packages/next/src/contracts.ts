import type { EggExt, EggTuple } from '@redux-eggs/core'
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
  NextComponentType,
  NextPage,
  NextPageContext,
} from 'next'
import type { AppContext } from 'next/app'
import type App from 'next/app'
import type { Store } from 'redux'

export type WithEggExt<S extends Store = Store> = S extends EggExt ? S : S & EggExt

export type InferGetStaticPathsQueryType<Fn> = Fn extends GetStaticPaths<infer Query>
  ? Partial<Query>
  : Fn extends (context?: GetStaticPathsContext) => Promise<GetStaticPathsResult<infer Query>>
  ? Partial<Query>
  : never

export interface AppWrapperOptions<
  S extends WithEggExt = WithEggExt,
  C extends
    | GetStaticPropsContext<any>
    | GetServerSidePropsContext<any>
    | GetStaticPathsContext
    | AppContext
    | NextPageContext = any,
> {
  beforeResult?: BeforeResult<S, C>
}

export interface BeforeResultExtraParams<
  C extends
    | GetStaticPropsContext<any>
    | GetServerSidePropsContext<any>
    | GetStaticPathsContext
    | AppContext
    | NextPageContext = any,
> {
  context: C
}

export type BeforeResult<
  S extends WithEggExt = WithEggExt,
  C extends
    | GetStaticPropsContext<any>
    | GetServerSidePropsContext<any>
    | GetStaticPathsContext
    | AppContext
    | NextPageContext = any,
> = (store: S, options: BeforeResultExtraParams<C>) => Promise<void>

export type StaticPathsFn<S extends WithEggExt = WithEggExt> = (store: S) => GetStaticPaths

export type StaticPropsFn<S extends WithEggExt = WithEggExt> = (store: S) => GetStaticProps

export type ServerSidePropsFn<S extends WithEggExt = WithEggExt> = (store: S) => GetServerSideProps

export type InitialAppPropsFn<S extends WithEggExt = WithEggExt> = (store: S) => (typeof App)['getInitialProps']

export type InitialPagePropsFn<S extends WithEggExt = WithEggExt> = (store: S) => NextPage['getInitialProps']

export interface AppWrapper<S extends WithEggExt = WithEggExt> {
  wrapGetInitialProps<Fn extends InitialAppPropsFn<S> = InitialAppPropsFn<S>>(
    fn: Fn,
  ): ReturnType<Fn> extends (typeof App)['getInitialProps']
    ? Exclude<(typeof App)['getInitialProps'], undefined>
    : never

  wrapApp<T extends NextComponentType<any, any, any> = NextComponentType<any, any, any>>(AppComponent: T): T
}

export interface PageWrapper<S extends WithEggExt = WithEggExt> {
  wrapGetStaticPaths<Fn extends StaticPathsFn<S> = StaticPathsFn<S>>(
    fn: Fn,
  ): GetStaticPaths<InferGetStaticPathsQueryType<ReturnType<Fn>>>

  wrapGetStaticProps<Fn extends StaticPropsFn<S> = StaticPropsFn<S>>(
    fn: Fn,
  ): Fn extends StaticPropsFn<S>
    ? ReturnType<Fn> extends GetStaticProps<
        Exclude<infer Props, Exclude<keyof GetStaticPropsResult<any>, 'props'>>,
        infer Query
      >
      ? Props extends undefined
        ? never
        : GetStaticProps<Props, Query>
      : never
    : GetStaticProps<{}>

  wrapGetStaticProps<Fn extends Record<string, unknown> = Record<string, never>>(
    props: Fn,
  ): Fn extends Record<string, never> ? GetStaticProps<{}> : GetStaticProps<Fn>

  wrapGetStaticProps(): GetStaticProps<{}>

  wrapGetServerSideProps<Fn extends ServerSidePropsFn<S> = ServerSidePropsFn<S>>(
    fn: Fn,
  ): Fn extends ServerSidePropsFn<S>
    ? ReturnType<Fn> extends GetServerSideProps<
        Exclude<infer Props, Exclude<keyof GetServerSidePropsResult<any>, 'props'>>,
        infer Query
      >
      ? Props extends undefined
        ? never
        : GetServerSideProps<Props, Query>
      : never
    : GetServerSideProps<{}>

  wrapGetServerSideProps<Props extends Record<string, unknown> = Record<string, never>>(
    props: Props,
  ): Props extends Record<string, never> ? GetServerSideProps<{}> : GetServerSideProps<Props>

  wrapGetServerSideProps(): GetServerSideProps<{}>

  wrapGetInitialProps<Fn extends InitialPagePropsFn<S> = InitialPagePropsFn<S>>(
    fn: Fn,
  ): ReturnType<Fn> extends NextPage<infer P, infer IP>['getInitialProps']
    ? Exclude<NextPage<any extends P ? never : P, any extends IP ? never : IP>['getInitialProps'], undefined>
    : Exclude<NextPage['getInitialProps'], undefined>

  wrapGetInitialProps<Props extends Record<string, unknown> = {}>(
    props: Props,
  ): Props extends Record<string, unknown>
    ? Exclude<NextPage<Props>['getInitialProps'], undefined>
    : Exclude<NextPage['getInitialProps'], undefined>

  wrapGetInitialProps(): Exclude<NextPage['getInitialProps'], undefined>

  wrapPage<T extends NextPage<any, any> = NextPage>(page: T): T
}

export interface WrapperInitializerOptions {
  hydrationActionType?: string
}

export interface WrapperInitializerResults<S extends WithEggExt = WithEggExt> {
  getAppWrapper(eggs?: EggTuple, options?: AppWrapperOptions<S>): AppWrapper<S>
  getPageWrapper(eggs?: EggTuple): PageWrapper<S>
}
