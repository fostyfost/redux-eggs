import Head from 'next/head'
import React from 'react'

import { Aviasales } from '../components/aviasales'
import { withDynamicModuleLoader } from '../components/common/with-dynamic-module-loader'
import { getAviasalesModule } from '../modules/aviasales/module'
import { NextPageWithStore } from '../store/contracts'

interface Props {
  title: string
}

const AviasalesPage: NextPageWithStore<Props, Props> = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <h1>{title}</h1>
        <Aviasales />
      </div>
    </>
  )
}

AviasalesPage.getInitialProps = () => {
  return { title: 'Aviasales page' }
}

export default withDynamicModuleLoader(AviasalesPage, [getAviasalesModule()])
