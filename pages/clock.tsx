import Head from 'next/head'

import { Clock } from '@/components/clock'
import type { NextPageWithStore } from '@/store/contracts'

interface Props {
  title: string
}

const ClockPage: NextPageWithStore<Props, Props> = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {process.env.NEXT_PUBLIC_DISABLE_COMMON_MODULE === 'true' ? null : (
        <div>
          <h1>{title}</h1>
          <Clock />
        </div>
      )}
    </>
  )
}

ClockPage.getInitialProps = () => {
  return { title: 'Clock page' }
}

export default ClockPage
