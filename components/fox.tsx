import { FC, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { FoxPublicAction } from '@/modules/fox/action-creators'
import { errorSelector, foxSelector, isFoxLoading } from '@/modules/fox/selectors'

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
      {fox && (
        <>
          <div>
            <img src={fox} alt='Fox' style={{ maxHeight: '50vh' }} />
          </div>
          <button onClick={update}>Update</button>
        </>
      )}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  )
}

export { Fox }
