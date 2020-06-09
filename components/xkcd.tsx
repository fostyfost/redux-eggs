import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { xkcdInfoSelector, errorSelector, isXkcdInfoLoading } from '../modules/xkcd/selectors'
import { useRouter } from 'next/router'

const Xkcd = () => {
  const isLoading = useSelector(isXkcdInfoLoading)
  const info = useSelector(xkcdInfoSelector)
  const error = useSelector(errorSelector)

  const router = useRouter()
  const update = useCallback(() => {
    router.replace(`/xkcd?update=true`)
  }, [])

  useEffect(() => {
    router.replace(`/xkcd`)
  }, [])

  if (isLoading) {
    return <div>Load xkcd info ...</div>
  }

  return (
    <div>
      {info && (
        <>
          <img loading='lazy' src={info.img} alt={info.alt} />
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
