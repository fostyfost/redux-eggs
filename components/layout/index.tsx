import dynamic from 'next/dynamic'
import React, { FC } from 'react'

import { Clock } from '../clock'
import { Dog } from '../dog'
import { Xkcd } from '../xkcd'
import { Navigation } from './navigation'

const PageWrapper = dynamic<{}>(() => import('./page-wrapper').then(mod => mod.PageWrapper), { ssr: true })

const Layout: FC = ({ children }) => {
  return (
    <>
      <Navigation />
      <Clock />
      <Xkcd small />
      <Dog />
      {process.env.NEXT_PUBLIC_USE_NEXT_PAGE_TRANSITIONS === 'true' ? <PageWrapper>{children}</PageWrapper> : children}
    </>
  )
}

export { Layout }
