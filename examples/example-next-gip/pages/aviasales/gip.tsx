import type { NextPage } from 'next'
import Head from 'next/head'

import { Aviasales } from '@/components/aviasales'
import { getAviasalesEgg } from '@/eggs/aviasales'
import { AviasalesPublicAction } from '@/eggs/aviasales/events'
import { wrapperInitializer } from '@/store'

const AviasalesPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Aviasales page (with Get Initial Props)</title>
      </Head>
      <Aviasales />
    </div>
  )
}

const wrapper = wrapperInitializer.getPageWrapper([getAviasalesEgg()])

AviasalesPage.getInitialProps = wrapper.wrapGetInitialProps(() => () => {
  AviasalesPublicAction.getTickets()

  return {}
})

export default wrapper.wrapPage(AviasalesPage)
