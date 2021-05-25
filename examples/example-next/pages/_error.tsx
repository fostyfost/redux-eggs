import type { InferGetStaticPropsType, NextPage } from 'next'
import Head from 'next/head'

import { wrapperInitializer } from '@/store'

const ErrorPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ title }) => {
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

export const getStaticProps = wrapper.wrapGetStaticProps({ title: 'Error page' })

export default wrapper.wrapPage(ErrorPage)
