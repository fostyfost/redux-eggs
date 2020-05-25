import React from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { Picsum } from '../components/picsum'
import { getPicsumModule } from '../modules/picsum/module'
import { withDynamicModuleLoader } from '../components/common/with-dynamic-module-loader'

const PicsumPage: NextPage<{ title: string }> = ({ title }) => {
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

PicsumPage.getInitialProps = () => {
  return { title: 'Picsum page' }
}

export default withDynamicModuleLoader(PicsumPage, [getPicsumModule()])
