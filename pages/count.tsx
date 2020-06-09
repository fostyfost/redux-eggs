import React from 'react'
import Head from 'next/head'
import { Count } from '../components/count'
import { getCountModule } from '../modules/count/module'
import { withDynamicModuleLoader } from '../components/common/with-dynamic-module-loader'
import { NextPageWithStore } from '../store/contracts'

const CountPage: NextPageWithStore<{ title: string }> = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <h1>{title}</h1>
        <Count />
      </div>
    </>
  )
}

CountPage.getInitialProps = () => {
  return { title: 'Count page' }
}

export default withDynamicModuleLoader(CountPage, [getCountModule()])
