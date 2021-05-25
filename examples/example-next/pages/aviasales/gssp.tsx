import type { InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'

import { Aviasales } from '@/components/aviasales'
import { getAviasalesEgg } from '@/eggs/aviasales'
import { AviasalesPublicAction } from '@/eggs/aviasales/events'
import { wrapperInitializer } from '@/store'

const AviasalesPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
  return (
    <div>
      <Head>
        <title>Aviasales page (with Get Server-side Props)</title>
      </Head>
      <Aviasales />
    </div>
  )
}

const wrapper = wrapperInitializer.getPageWrapper([getAviasalesEgg()])

export const getServerSideProps = wrapper.wrapGetServerSideProps(() => async () => {
  AviasalesPublicAction.getTickets()

  return {
    props: {},
  }
})

export default wrapper.wrapPage(AviasalesPage)
