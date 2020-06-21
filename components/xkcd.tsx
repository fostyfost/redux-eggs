import React, { FC, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { XkcdPublicAction } from '../modules/xkcd/action-creators'
import { errorSelector, isXkcdInfoLoading, xkcdInfoSelector } from '../modules/xkcd/selectors'

const Xkcd: FC<{ small?: boolean }> = ({ small }) => {
  const isLoading = useSelector(isXkcdInfoLoading)
  const info = useSelector(xkcdInfoSelector)
  const error = useSelector(errorSelector)

  const dispatch = useDispatch()
  const update = useCallback(() => {
    dispatch(XkcdPublicAction.loadInfo())
  }, [dispatch])

  if (isLoading) {
    return <div>Load xkcd info ...</div>
  }

  if (small && info) {
    return (
      <div>
        <img src={info.img} alt={info.alt} width={100} />
      </div>
    )
  }

  return (
    <div>
      {info && (
        <>
          <img src={info.img} alt={info.alt} />
          <pre>
            <code>{JSON.stringify(info, null, 2)}</code>
          </pre>
          <button onClick={update}>Update</button>
        </>
      )}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  )
}

export { Xkcd }
