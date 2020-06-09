import React from 'react'
import Head from 'next/head'
import { NextPageWithStore } from '../store/contracts'

const IndexPage: NextPageWithStore<{ title: string }> = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
    </>
  )
}

IndexPage.getInitialProps = () => {
  return { title: 'Index page' }
}

export default IndexPage
