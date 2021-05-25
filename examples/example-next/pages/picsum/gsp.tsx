import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Head from 'next/head'

import { Picsum } from '@/components/picsum'
import { getPicsumEgg } from '@/eggs/picsum'
import { PicsumPublicAction } from '@/eggs/picsum/action-creators'
import { wrapperInitializer } from '@/store'

type Props = {
  title: string
}

const wrapper = wrapperInitializer.getPageWrapper([getPicsumEgg()])

const PicsumPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = wrapper.wrapPage(({ title }) => {
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

export const getStaticProps: GetStaticProps<Props> = wrapper.wrapGetStaticProps(store => () => {
  store.dispatch(PicsumPublicAction.loadPics())

  return {
    props: {
      title: 'Picsum page (with Get Static Props)',
    },
  }
})

export default PicsumPage
