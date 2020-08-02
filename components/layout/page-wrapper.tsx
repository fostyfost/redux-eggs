import { PageTransition } from 'next-page-transitions'
import { useRouter } from 'next/router'
import React, { FC, Fragment } from 'react'

const Loader = () => {
  return (
    <div className='loader'>
      <style jsx>{`
        .loader {
          border: 8px solid #f3f3f3; /* Light grey */
          border-top: 8px solid #3498db; /* Blue */
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 2s linear infinite;
          margin-left: auto;
          margin-right: auto;
          margin-top: 40px;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

const TIMEOUT = 400

const PageWrapper: FC = ({ children }) => {
  const router = useRouter()

  return (
    <>
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

export { PageWrapper }
