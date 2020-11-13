import Head from 'next/head'

import { NextPageWithStore } from '@/store/contracts'

interface Props {
  title: string
}

const IndexPage: NextPageWithStore<Props, Props> = ({ title }) => {
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
