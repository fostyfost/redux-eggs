import type { InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'

import { wrapperInitializer } from '@/store'

const IndexPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ title }) => {
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

export const getServerSideProps = wrapper.wrapGetServerSideProps({ title: 'Index page (with Get Server-side Props)' })

export default wrapper.wrapPage(IndexPage)
