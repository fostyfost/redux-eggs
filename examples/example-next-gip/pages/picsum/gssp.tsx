import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'

import { Picsum } from '@/components/picsum'
import { getPicsumEgg } from '@/eggs/picsum'
import { PicsumPublicAction } from '@/eggs/picsum/action-creators'
import { wrapperInitializer } from '@/store'

type Props = {
  title: string
}

const wrapper = wrapperInitializer.getPageWrapper([getPicsumEgg()])

const PicsumPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = wrapper.wrapPage(({ title }) => {
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

export const getServerSideProps: GetServerSideProps<Props> = wrapper.wrapGetServerSideProps(store => async () => {
  store.dispatch(PicsumPublicAction.loadPics())

  return {
    props: {
      title: 'Picsum page (with Get Server-side Props)',
    },
  }
})

export default PicsumPage
