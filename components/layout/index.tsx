import React, { FC, ReactNode } from 'react'

import { Clock } from '../clock'
import { Xkcd } from '../xkcd'
import { Navigation } from './navigation'
import { Dog } from '../dog'

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Navigation />
      <Clock />
      <Xkcd small />
      <Dog />
      {children}
    </>
  )
}

export { Layout }
