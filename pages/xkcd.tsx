import React from 'react'
import Head from 'next/head'
import { NextPageWithStore } from '../store/contracts'
import { Xkcd } from '../components/xkcd'
import { isXkcdInfoLoaded, xkcdInfoTitleSelector } from '../modules/xkcd/selectors'
import { waitForLoadedState } from '../store/wait-for-loaded-state'
import { XkcdPublicAction } from '../modules/xkcd/action-creators'

const XkcdPage: NextPageWithStore<{ title: string }> = ({ title }) => {
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

XkcdPage.getInitialProps = async ctx => {
  if (typeof window !== 'undefined' && ctx.query?.update) {
    ctx.store.dispatch(XkcdPublicAction.loadInfo())
  }

  await waitForLoadedState(ctx.store, isXkcdInfoLoaded)

  const title = xkcdInfoTitleSelector(ctx.store.getState())

  return { title: title || 'XKCD page' }
}

export default XkcdPage
