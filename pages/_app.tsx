/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import Link from 'next/link'
import { withRedux } from '../store'
import { Clock } from '../components/clock'
import { getClockModule } from '../modules/clock/module'
import { ISagaModule } from '../store/saga-extension/contracts'
import { AppPropsType } from 'next/dist/next-server/lib/utils'

const App: FC<AppPropsType> = ({ Component, pageProps }) => {
  return (
    <>
      <nav>
        <Link href={'/'}>
          <a style={{ padding: '10px' }}>Index page</a>
        </Link>
        <Link href={'/clock'}>
          <a style={{ padding: '10px' }}>Clock page</a>
        </Link>
        <Link href={'/count'}>
          <a style={{ padding: '10px' }}>Count page</a>
        </Link>
        <Link href={'/users'}>
          <a style={{ padding: '10px' }}>Users page</a>
        </Link>
        <Link href={'/picsum'}>
          <a style={{ padding: '10px' }}>Picsum page</a>
        </Link>
      </nav>
      <Clock />
      <Component {...pageProps} />
    </>
  )
}

export default withRedux(App, [getClockModule()] as ISagaModule[])
