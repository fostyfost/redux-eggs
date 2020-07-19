import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { DogPublicAction } from '../modules/dog/action-creators'
import { dogSelector, errorSelector, isDogLoading } from '../modules/dog/selectors'

const Dog = () => {
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
      {dog && (
        <>
          <div>
            <img src={dog} alt='Dog' style={{ maxHeight: '400px' }} />
          </div>
          <button onClick={update}>Update</button>
        </>
      )}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  )
}

export { Dog }
