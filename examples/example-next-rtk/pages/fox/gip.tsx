import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'

import { getFoxEgg } from '@/eggs/fox'
import { FoxPublicAction } from '@/eggs/fox/slice'
import { wrapperInitializer } from '@/store'

interface Props {
  title: string
}

const Fox = dynamic<Record<string, never>>(() => import('@/components/fox').then(mod => mod.Fox), { ssr: true })

const FoxPage: NextPage<Props> = ({ title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <Fox />
    </div>
  )
}

const wrapper = wrapperInitializer.getPageWrapper([getFoxEgg()])

FoxPage.getInitialProps = wrapper.wrapGetInitialProps(store => () => {
  store.dispatch(FoxPublicAction.loadFox())

  return {
    title: 'Fox page (with Get Initial Props)',
  }
})

export default wrapper.wrapPage(FoxPage)
