import type { NextPage } from 'next'
import Head from 'next/head'

import { Clock } from '@/components/clock'
import { getClockEgg } from '@/eggs/clock'
import { wrapperInitializer } from '@/store'

interface Props {
  title: string
}

const ClockPage: NextPage<Props> = ({ title }) => {
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

ClockPage.getInitialProps = wrapper.wrapGetInitialProps({ title: 'Clock page (with Get Initial Props)' })

export default wrapper.wrapPage(ClockPage)
