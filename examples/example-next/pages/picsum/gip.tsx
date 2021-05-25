import type { NextPage } from 'next'
import Head from 'next/head'

import { Picsum } from '@/components/picsum'
import { getPicsumEgg } from '@/eggs/picsum'
import { PicsumPublicAction } from '@/eggs/picsum/action-creators'
import { wrapperInitializer } from '@/store'

interface Props {
  title: string
}

const wrapper = wrapperInitializer.getPageWrapper([getPicsumEgg()])

const PicsumPage: NextPage<Props> = wrapper.wrapPage(({ title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <Picsum />
    </div>
  )
})

PicsumPage.getInitialProps = wrapper.wrapGetInitialProps(store => () => {
  store.dispatch(PicsumPublicAction.loadPics())

  return {
    title: 'Picsum page (with Get Initial Props)',
  }
})

export default PicsumPage
