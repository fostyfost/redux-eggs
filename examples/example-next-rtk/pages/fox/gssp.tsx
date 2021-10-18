import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'

import { getFoxEgg } from '@/eggs/fox'
import { FoxPublicAction } from '@/eggs/fox/slice'
import { wrapperInitializer } from '@/store'

interface Props {
  title: string
}

const Fox = dynamic<Record<string, never>>(() => import('@/components/fox').then(mod => mod.Fox), { ssr: true })

const FoxPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ title }) => {
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

export const getServerSideProps: GetServerSideProps<Props> = wrapper.wrapGetServerSideProps(store => async () => {
  store.dispatch(FoxPublicAction.loadFox())

  return {
    props: {
      title: 'Fox page (with Get Server-side Props)',
    },
  }
})

export default wrapper.wrapPage(FoxPage)
