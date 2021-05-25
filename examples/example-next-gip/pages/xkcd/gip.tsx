import type { NextPage } from 'next'
import Head from 'next/head'

import { Xkcd } from '@/components/xkcd'
import { isXkcdInfoLoaded, xkcdInfoTitleSelector } from '@/eggs/xkcd/selectors'
import { wrapperInitializer } from '@/store'
import { waitForLoadedState } from '@/store/wait-for-loaded-state'

interface Props {
  title: string
}

const XkcdPage: NextPage<Props> = ({ title }) => {
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

const wrapper = wrapperInitializer.getPageWrapper()

XkcdPage.getInitialProps = wrapper.wrapGetInitialProps(store => async () => {
  await waitForLoadedState(store, isXkcdInfoLoaded)

  const title = xkcdInfoTitleSelector(store.getState())

  return {
    title: `${title || 'XKCD page'} (with Get Initial Props)`,
  }
})

export default wrapper.wrapPage(XkcdPage)
