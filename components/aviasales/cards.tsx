import { FC, memo } from 'react'
import { useSelector } from 'react-redux'

import { ticketsIdsSelector } from '@/modules/aviasales/selectors'

import { Card } from './card'

const MemoizedCard = memo(Card)

const Cards: FC = () => {
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
