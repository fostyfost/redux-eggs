/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import Link from 'next/link'
import { withRedux } from '../store'
import { Clock } from '../components/clock'
import { AppPropsType } from 'next/dist/next-server/lib/utils'
import { Xkcd } from '../components/xkcd'
import { getCommonModule } from '../modules/common/module'

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
        <Link href={'/xkcd'}>
          <a style={{ padding: '10px' }}>XKCD page</a>
        </Link>
      </nav>
      <Clock />
      <Xkcd />
      <Component {...pageProps} />
    </>
  )
}

export default withRedux(App, [getCommonModule()])
