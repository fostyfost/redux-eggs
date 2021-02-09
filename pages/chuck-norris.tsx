import Head from 'next/head'

import { ChuckNorrisJoke } from '@/components/chuck-norris-joke'
import type { NextPageWithStore } from '@/store/contracts'

const styles = {
  fontSize: '30px',
  display: 'flex',
  height: '110vh',
  alignItems: 'center',
  justifyContent: 'center',
}

interface Props {
  title: string
}

const ChuckNorrisPage: NextPageWithStore<Props, Props> = ({ title }) => {
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

ChuckNorrisPage.getInitialProps = () => {
  return { title: 'Intersection observer page' }
}

export default ChuckNorrisPage
