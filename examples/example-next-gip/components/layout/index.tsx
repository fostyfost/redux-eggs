import type { FC } from 'react'

import { Navigation } from '@/components/layout/navigation'
import { Xkcd } from '@/components/xkcd'

const Layout: FC = ({ children }) => {
  return (
    <>
      <p>
        Application with disabled{' '}
        <a
          target='_blank'
          rel='noreferrer'
          href='https://nextjs.org/docs/advanced-features/automatic-static-optimization'
        >
          static optimization
        </a>
      </p>
      <Navigation />
      <Xkcd small />
      {children}
    </>
  )
}

export { Layout }
