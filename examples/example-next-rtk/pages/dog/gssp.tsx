import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'

import { Dog } from '@/components/dog'
import { getDogEgg } from '@/eggs/dog'
import { DogPublicAction } from '@/eggs/dog/slice'
import { wrapperInitializer } from '@/store'

interface Props {
  title: string
}

const DogPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ title }) => {
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

export const getServerSideProps: GetServerSideProps<Props> = wrapper.wrapGetServerSideProps(store => async () => {
  store.dispatch(DogPublicAction.loadDog())

  return {
    props: {
      title: 'Dog page (with Get Server-side Props)',
    },
  }
})

export default wrapper.wrapPage(DogPage)
