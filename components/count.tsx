import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CountPublicAction } from '../modules/count/action-creators'
import { countSelector } from '../modules/count/selectors'

const Count = () => {
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
