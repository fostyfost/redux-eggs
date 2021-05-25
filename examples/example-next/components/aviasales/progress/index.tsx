import NProgress from 'nprogress'
import type { FC } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { isTicketsLoadingSelector } from '@/eggs/aviasales/selectors'

const Progress: FC = () => {
  const isLoading = useSelector(isTicketsLoadingSelector)

  useEffect(() => {
    NProgress.configure({ showSpinner: false })
    return () => {
      NProgress.remove()
    }
  }, [])

  useEffect(() => {
    if (isLoading) {
      NProgress.start()
    } else {
      NProgress.done()
    }
  }, [isLoading])

  return (
    <style jsx global>{`
      #nprogress {
        pointer-events: none;
      }

      #nprogress .bar {
        background: var(--secondary-color);

        position: fixed;
        z-index: 1031;
        top: 0;
        left: 0;

        width: 100%;
        height: 5px;
      }

      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 10px var(--secondary-color), 0 0 5px var(--secondary-color);
        opacity: 1;
        transform: rotate(3deg) translate(0px, -4px);
      }
    `}</style>
  )
}

export { Progress }
