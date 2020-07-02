import Head from 'next/head'
import React from 'react'

import { NextPageWithStore } from '../store/contracts'
import { ChuckNorrisJoke } from '../components/chuck-norris-joke'

const styles = {
  fontSize: '30px',
  display: 'flex',
  height: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
}

const IntersectionObserverPage: NextPageWithStore<{ title: string }> = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <h1>{title}</h1>
        <div style={{ ...styles, background: 'red' }}>Scroll ...</div>
        <ChuckNorrisJoke />
        <div style={{ ...styles, background: 'green' }}>Scroll ...</div>
        <ChuckNorrisJoke />
        <div style={{ ...styles, background: 'blue' }}>Scroll ...</div>
        <ChuckNorrisJoke />
        <div style={styles}>Finish!</div>
      </div>
    </>
  )
}

IntersectionObserverPage.getInitialProps = () => {
  return { title: 'Intersection observer page' }
}

export default IntersectionObserverPage
