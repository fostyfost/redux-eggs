import type { NextPage } from 'next'
import Head from 'next/head'

import { Count } from '@/components/count'
import { getCountEgg } from '@/eggs/count'
import { wrapperInitializer } from '@/store'

interface Props {
  title: string
}

const CountPage: NextPage<Props> = ({ title }) => {
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

CountPage.getInitialProps = wrapper.wrapGetInitialProps({ title: 'Count page (with Get Initial Props)' })

export default wrapper.wrapPage(CountPage)
