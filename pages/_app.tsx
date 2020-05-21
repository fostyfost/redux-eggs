/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import App, { AppInitialProps, AppContext } from 'next/app'
import Link from 'next/link'
import { withRedux } from '../store'
import { Clock } from '../components/clock'

class WrappedApp extends App<AppInitialProps> {
  static async getInitialProps({ Component, ctx }: AppContext) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

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
        </nav>
        <Clock />
        <Component {...pageProps} />
      </>
    )
  }
}

export default withRedux(WrappedApp)
