import React, { memo } from 'react'
import { Card } from './card'
import { useSelector } from 'react-redux'
import { ticketsIdsSelector } from '../../modules/aviasales/selectors'

const MemoizedCard = memo(Card)

const Cards = () => {
  const ids = useSelector(ticketsIdsSelector)

  return (
    <ul>
      {ids.map(id => (
        <li key={id}>
          <MemoizedCard id={id} />
        </li>
      ))}
    </ul>
  )
}

export { Cards }
