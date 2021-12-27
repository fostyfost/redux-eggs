import type { FC } from 'react'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { useAppDispatch } from '../store'
import { loadXkcdInfo } from '../store/eggs/xkcd/action-creators'
import { isXkcdInfoLoading, xkcdInfoSelector } from '../store/eggs/xkcd/selectors'
import { Loading } from './loading'

const XkcdInfo: FC = () => {
  const info = useSelector(xkcdInfoSelector)

  const dispatch = useAppDispatch()

  const handleUpdate = useCallback(() => {
    dispatch(loadXkcdInfo())
  }, [dispatch])

  if (info) {
    return (
      <>
        <img src={info.img} alt={info.alt} width={700} height={475} style={{ objectFit: 'contain' }} />
        <pre style={{ overflow: 'auto' }}>
          <code>{JSON.stringify(info, undefined, 2)}</code>
        </pre>
        <button onClick={handleUpdate}>Update</button>
      </>
    )
  }

  return null
}

export const Xkcd: FC = () => {
  const isLoading = useSelector(isXkcdInfoLoading)

  return (
    <div>
      <h2>XKCD footer</h2>
      {isLoading ? <Loading /> : <XkcdInfo />}
    </div>
  )
}
