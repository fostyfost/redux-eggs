import Head from 'next/head'

import { Navigation } from '@/components/layout/navigation'
import type { NextPageWithStore } from '@/store/contracts'

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
      {process.env.NEXT_PUBLIC_DISABLE_COMMON_MODULE === 'true' ? <Navigation /> : null}
    </>
  )
}

IndexPage.getInitialProps = () => {
  return { title: 'Index page' }
}

export default IndexPage
