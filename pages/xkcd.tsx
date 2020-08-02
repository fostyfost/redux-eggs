import Head from 'next/head'
import React from 'react'

import { Xkcd } from '../components/xkcd'
import { isXkcdInfoLoaded, xkcdInfoTitleSelector } from '../modules/xkcd/selectors'
import { NextPageWithStore } from '../store/contracts'
import { waitForLoadedState } from '../store/wait-for-loaded-state'

interface Props {
  title: string
}

const XkcdPage: NextPageWithStore<Props, Props> = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <h1>{title}</h1>
        <Xkcd />
      </div>
    </>
  )
}

XkcdPage.getInitialProps = async context => {
  await waitForLoadedState(context.store, isXkcdInfoLoaded)

  const title = xkcdInfoTitleSelector(context.store.getState())

  return { title: title || 'XKCD page' }
}

export default XkcdPage
