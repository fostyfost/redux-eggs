import Head from 'next/head'

import { Xkcd } from '@/components/xkcd'
import { isXkcdInfoLoaded, xkcdInfoTitleSelector } from '@/modules/xkcd/selectors'
import { NextPageWithStore } from '@/store/contracts'
import { waitForLoadedState } from '@/store/wait-for-loaded-state'

const defaultTitle = 'XKCD page'

interface Props {
  title: string
}

const XkcdPage: NextPageWithStore<Props, Props> = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {process.env.NEXT_PUBLIC_DISABLE_COMMON_MODULE === 'true' ? null : (
        <div>
          <h1>{title}</h1>
          <Xkcd />
        </div>
      )}
    </>
  )
}

XkcdPage.getInitialProps = async context => {
  if (process.env.NEXT_PUBLIC_DISABLE_COMMON_MODULE === 'true') {
    return { title: defaultTitle }
  }

  await waitForLoadedState(context.store, isXkcdInfoLoaded)

  const title = xkcdInfoTitleSelector(context.store.getState())

  return { title: title || defaultTitle }
}

export default XkcdPage
