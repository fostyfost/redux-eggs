import NextImage from 'next/image'
import type { FC } from 'react'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { FoxPublicAction } from '@/eggs/fox/action-creators'
import { errorSelector, foxSelector, isFoxLoading } from '@/eggs/fox/selectors'

const Fox: FC = () => {
  const isLoading = useSelector(isFoxLoading)
  const fox = useSelector(foxSelector)
  const error = useSelector(errorSelector)

  const dispatch = useDispatch()

  const update = useCallback(() => {
    dispatch(FoxPublicAction.loadFox())
  }, [dispatch])

  if (isLoading) {
    return <div>Load fox ...</div>
  }

  return (
    <div>
      {fox ? (
        <>
          <div>
            <NextImage src={fox} alt='Fox' width={700} height={475} layout='fixed' objectFit='contain' unoptimized />
          </div>
          <button onClick={update}>Update</button>
        </>
      ) : null}
      {!fox && error ? <p style={{ color: 'red' }}>Error: {error}</p> : null}
    </div>
  )
}

export { Fox }
