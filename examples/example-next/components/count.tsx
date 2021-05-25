import type { FC } from 'react'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { CountPublicAction } from '@/eggs/count/action-creators'
import { countSelector } from '@/eggs/count/selectors'

const Count: FC = () => {
  const dispatch = useDispatch()

  const dispatchIncrement = useCallback(() => {
    dispatch(CountPublicAction.increment())
  }, [dispatch])

  const dispatchDecrement = useCallback(() => {
    dispatch(CountPublicAction.decrement())
  }, [dispatch])

  const dispatchReset = useCallback(() => {
    dispatch(CountPublicAction.reset())
  }, [dispatch])

  const count = useSelector(countSelector)

  return (
    <div>
      <p>
        Count: <span>{count}</span>
      </p>
      <button onClick={dispatchIncrement}>+1</button>
      <button onClick={dispatchDecrement}>-1</button>
      <button onClick={dispatchReset}>Reset</button>
    </div>
  )
}

export { Count }
