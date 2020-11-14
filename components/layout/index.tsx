import dynamic from 'next/dynamic'
import { FC } from 'react'

import { Clock } from '../clock'
import { Dog } from '../dog'
import { Xkcd } from '../xkcd'
import { Navigation } from './navigation'

const PageWrapper = dynamic<Record<string, unknown>>(() => import('./page-wrapper').then(mod => mod.PageWrapper), {
  ssr: true,
})

const Layout: FC = ({ children }) => {
  return (
    <>
      {process.env.NEXT_PUBLIC_DISABLE_COMMON_MODULE === 'true' ? null : (
        <>
          <Navigation />
          <Clock />
          <Xkcd small />
          <Dog />
        </>
      )}
      {process.env.NEXT_PUBLIC_USE_NEXT_PAGE_TRANSITIONS === 'true' ? <PageWrapper>{children}</PageWrapper> : children}
    </>
  )
}

export { Layout }
