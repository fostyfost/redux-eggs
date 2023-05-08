import NextImage from 'next/image'
import type { FC } from 'react'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { DogPublicAction } from '@/eggs/dog/action-creators'
import { dogSelector, errorSelector, isDogLoading } from '@/eggs/dog/selectors'

const Dog: FC = () => {
  const isLoading = useSelector(isDogLoading)
  const dog = useSelector(dogSelector)
  const error = useSelector(errorSelector)

  const dispatch = useDispatch()

  const update = useCallback(() => {
    dispatch(DogPublicAction.loadDog())
  }, [dispatch])

  if (isLoading) {
    return <div>Load dog ...</div>
  }

  return (
    <div>
      {dog ? (
        <>
          <div>
            <NextImage
              src={dog}
              alt='Dog'
              width={700}
              height={475}
              unoptimized
              style={{
                objectFit: 'contain',
              }}
            />
          </div>
          <button onClick={update}>Update</button>
        </>
      ) : null}
      {!dog && error ? <p style={{ color: 'red' }}>Error: {error}</p> : null}
    </div>
  )
}

export { Dog }
