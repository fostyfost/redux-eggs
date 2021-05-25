import type { NextPage } from 'next'
import Head from 'next/head'

import { Dog } from '@/components/dog'
import { getDogEgg } from '@/eggs/dog'
import { DogPublicAction } from '@/eggs/dog/action-creators'
import { wrapperInitializer } from '@/store'

interface Props {
  title: string
}

const DogPage: NextPage<Props> = ({ title }) => {
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

DogPage.getInitialProps = wrapper.wrapGetInitialProps(store => () => {
  store.dispatch(DogPublicAction.loadDog())

  return {
    title: 'Dog page (with Get Initial Props)',
  }
})

export default wrapper.wrapPage(DogPage)
