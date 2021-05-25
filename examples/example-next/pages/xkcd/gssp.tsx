import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'

import { Xkcd } from '@/components/xkcd'
import { getXkcdEgg } from '@/eggs/xkcd'
import { isXkcdInfoLoaded, xkcdInfoTitleSelector } from '@/eggs/xkcd/selectors'
import { wrapperInitializer } from '@/store'
import { waitForLoadedState } from '@/store/wait-for-loaded-state'

interface Props {
  title: string
}

const XkcdPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <Xkcd />
    </div>
  )
}

const wrapper = wrapperInitializer.getPageWrapper([getXkcdEgg()])

export const getServerSideProps: GetServerSideProps<Props> = wrapper.wrapGetServerSideProps(store => async () => {
  await waitForLoadedState(store, isXkcdInfoLoaded)

  const title = xkcdInfoTitleSelector(store.getState())

  if (typeof title !== 'string') {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      title: `${title} (with Get Server-side Props)`,
    },
  }
})

export default wrapper.wrapPage(XkcdPage)
