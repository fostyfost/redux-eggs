import React from 'react'
import Head from 'next/head'
import { Picsum } from '../components/picsum'
import { getPicsumModule } from '../modules/picsum/module'
import { withDynamicModuleLoader } from '../components/common/with-dynamic-module-loader'
import { NextPageWithStore } from '../store/contracts'
import { picsSelector } from '../modules/picsum/selectors'
import { PicsumPublicAction } from '../modules/picsum/action-creators'

const PicsumPage: NextPageWithStore<{ title: string }> = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <h1>{title}</h1>
        <Picsum />
      </div>
    </>
  )
}

PicsumPage.getInitialProps = ctx => {
  if (!picsSelector(ctx.store.getState())) {
    ctx.store.dispatch(PicsumPublicAction.loadPics())
  }

  return { title: 'Picsum page' }
}

export default withDynamicModuleLoader(PicsumPage, [getPicsumModule()])
