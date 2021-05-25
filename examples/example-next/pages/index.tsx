import type { NextPage } from 'next'
import Head from 'next/head'

import { wrapperInitializer } from '@/store'

interface Props {
  title: string
}

const IndexPage: NextPage<Props> = ({ title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
    </div>
  )
}

const wrapper = wrapperInitializer.getPageWrapper()

IndexPage.getInitialProps = wrapper.wrapGetInitialProps({ title: 'Index page (with Get Initial Props)' })

export default wrapper.wrapPage(IndexPage)
