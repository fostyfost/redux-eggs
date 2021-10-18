import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Head from 'next/head'

import { Dog } from '@/components/dog'
import { getDogEgg } from '@/eggs/dog'
import { DogPublicAction } from '@/eggs/dog/slice'
import { wrapperInitializer } from '@/store'

interface Props {
  title: string
}

const DogPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <Dog />
    </div>
  )
}

const wrapper = wrapperInitializer.getPageWrapper([getDogEgg()])

export const getStaticProps: GetStaticProps<Props> = wrapper.wrapGetStaticProps(store => () => {
  store.dispatch(DogPublicAction.loadDog())

  return {
    props: {
      title: 'Dog page (with Get Static Props)',
    },
  }
})

export default wrapper.wrapPage(DogPage)
