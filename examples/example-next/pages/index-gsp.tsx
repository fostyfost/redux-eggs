import type { InferGetStaticPropsType, NextPage } from 'next'
import Head from 'next/head'

import { wrapperInitializer } from '@/store'

const IndexPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ title }) => {
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

export const getStaticProps = wrapper.wrapGetStaticProps({ title: 'Index page (with Get Static Props)' })

export default wrapper.wrapPage(IndexPage)
