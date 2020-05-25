import React from 'react'
import { NextPage } from 'next'
import Head from 'next/head'

const IndexPage: NextPage<{ title: string }> = ({ title }) => {
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
