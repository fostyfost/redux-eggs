import type { InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'

import { ChuckNorrisJoke } from '@/components/chuck-norris-content'
import { wrapperInitializer } from '@/store'

const styles = {
  fontSize: '30px',
  display: 'flex',
  height: '110vh',
  alignItems: 'center',
  justifyContent: 'center',
}

const ChuckNorrisPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <div style={{ ...styles, background: 'red' }}>Scroll ...</div>
      <ChuckNorrisJoke />
      <div style={{ ...styles, background: 'green' }}>Scroll ...</div>
      <ChuckNorrisJoke />
      <div style={{ ...styles, background: 'blue' }}>Scroll ...</div>
      <ChuckNorrisJoke />
      <div style={styles}>Finish!</div>
    </div>
  )
}

const wrapper = wrapperInitializer.getPageWrapper()

export const getServerSideProps = wrapper.wrapGetServerSideProps({
  title: 'Chuck Norris page (with Get Server-side Props)',
})

export default wrapper.wrapPage(ChuckNorrisPage)
