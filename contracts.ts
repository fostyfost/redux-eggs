import { NextPage } from 'next'
import { ISagaModule } from './store/saga-extension/contracts'

export type NextPageWithModules<
  Props = {},
  InitialProps = Props,
  Modules = ISagaModule<any, any>[] | undefined
> = NextPage<Props, InitialProps> & { modules?: Modules }
