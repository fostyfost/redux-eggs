/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import App, { AppInitialProps } from 'next/app'
import Link from 'next/link'
import { withRedux } from '../store'
import { Clock } from '../components/clock'
import { getClockModule } from '../modules/clock/module'
import { ISagaModule } from '../store/saga-extension/contracts'

class WrappedApp extends App<AppInitialProps> {
  static initialModules: ISagaModule<any, any>[] = [getClockModule()]

  render() {
    const { Component, pageProps } = this.props

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
}

export default withRedux(WrappedApp)
