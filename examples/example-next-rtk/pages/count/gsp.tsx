import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Head from 'next/head'

import { Count } from '@/components/count'
import { getCountEgg } from '@/eggs/count'
import { wrapperInitializer } from '@/store'

interface Props {
  title: string
}

const CountPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <Count />
    </div>
  )
}

const wrapper = wrapperInitializer.getPageWrapper([getCountEgg()])

export const getStaticProps: GetStaticProps<Props> = wrapper.wrapGetStaticProps({
  title: 'Count page (with Get Static Props)',
})

export default wrapper.wrapPage(CountPage)
