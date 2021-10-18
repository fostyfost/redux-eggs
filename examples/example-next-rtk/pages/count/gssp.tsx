import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'

import { Count } from '@/components/count'
import { getCountEgg } from '@/eggs/count'
import { wrapperInitializer } from '@/store'

interface Props {
  title: string
}

const CountPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ title }) => {
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

export const getServerSideProps: GetServerSideProps<Props> = wrapper.wrapGetServerSideProps({
  title: 'Count page (with Get Server-side Props)',
})

export default wrapper.wrapPage(CountPage)
