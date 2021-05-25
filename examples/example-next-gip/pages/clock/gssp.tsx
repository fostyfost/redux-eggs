import type { InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'

import { Clock } from '@/components/clock'
import { getClockEgg } from '@/eggs/clock'
import { wrapperInitializer } from '@/store'

const ClockPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <Clock />
    </div>
  )
}

const wrapper = wrapperInitializer.getPageWrapper([getClockEgg()])

export const getServerSideProps = wrapper.wrapGetServerSideProps({
  title: 'Clock page (with Get Server-side Props)',
})

export default wrapper.wrapPage(ClockPage)
