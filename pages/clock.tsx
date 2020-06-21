import Head from 'next/head'
import React from 'react'

import { Clock } from '../components/clock'
import { NextPageWithStore } from '../store/contracts'

const ClockPage: NextPageWithStore<{ title: string }> = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <h1>{title}</h1>
        <Clock />
      </div>
    </>
  )
}

ClockPage.getInitialProps = () => {
  return { title: 'Clock page' }
}

export default ClockPage
