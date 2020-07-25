import { PageTransition } from 'next-page-transitions'
import { useRouter } from 'next/router'
import React, { FC, Fragment } from 'react'

import { Clock } from '../clock'
import { Dog } from '../dog'
import { Xkcd } from '../xkcd'
import { Loader } from './loader'
import { Navigation } from './navigation'

const TIMEOUT = 400

const Layout: FC = ({ children }) => {
  const router = useRouter()

  return (
    <>
      <Navigation />
      <Clock />
      <Xkcd small />
      <Dog />
      <PageTransition
        skipInitialTransition
        timeout={TIMEOUT}
        classNames='page-transition'
        loadingComponent={<Loader />}
        loadingDelay={500}
        loadingTimeout={{ enter: TIMEOUT, exit: 0 }}
        loadingClassNames='loading-indicator'
      >
        <Fragment key={router.route}>{children}</Fragment>
      </PageTransition>
      <style jsx global>{`
        .page-transition-enter {
          opacity: 0;
          transform: translate3d(0, 20px, 0);
        }

        .page-transition-enter-active {
          opacity: 1;
          transform: translate3d(0, 0, 0);
          transition: opacity ${TIMEOUT}ms, transform ${TIMEOUT}ms;
        }

        .page-transition-exit {
          opacity: 1;
        }

        .page-transition-exit-active {
          opacity: 0;
          transition: opacity ${TIMEOUT}ms;
        }

        .loading-indicator-appear,
        .loading-indicator-enter {
          opacity: 0;
        }

        .loading-indicator-appear-active,
        .loading-indicator-enter-active {
          opacity: 1;
          transition: opacity ${TIMEOUT}ms;
        }
      `}</style>
    </>
  )
}

export { Layout }
