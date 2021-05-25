import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'

import { getFoxEgg } from '@/eggs/fox'
import { FoxPublicAction } from '@/eggs/fox/action-creators'
import { wrapperInitializer } from '@/store'

interface Props {
  title: string
}

const Fox = dynamic<Record<string, never>>(() => import('@/components/fox').then(mod => mod.Fox), { ssr: true })

const FoxPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ title }) => {
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

export const getStaticProps: GetStaticProps<Props> = wrapper.wrapGetStaticProps(store => () => {
  store.dispatch(FoxPublicAction.loadFox())

  return {
    props: {
      title: 'Fox page (with Get Static Props)',
    },
  }
})

export default wrapper.wrapPage(FoxPage)
