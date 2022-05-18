import type { FC, PropsWithChildren } from 'react'

import { Count } from '@/components/count'
import { Navigation } from '@/components/layout/navigation'
import { Xkcd } from '@/components/xkcd'

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <p>
        Application with enabled{' '}
        <a
          target='_blank'
          rel='noreferrer'
          href='https://nextjs.org/docs/advanced-features/automatic-static-optimization'
        >
          static optimization
        </a>{' '}
        and{' '}
        <a target='_blank' rel='noreferrer' href='https://redux-toolkit.js.org/'>
          Redux Toolkit
        </a>
      </p>
      <Navigation />
      <Xkcd small />
      <Count />
      {children}
    </>
  )
}

export { Layout }
