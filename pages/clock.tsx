import React from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { Clock } from '../components/clock'

const ClockPage: NextPage<{ title: string }> = ({ title }) => {
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
