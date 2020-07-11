import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { getTicketByIdSelector } from '../../modules/aviasales/selectors'
import { AviasalesAwareState } from '../../modules/aviasales/contracts/state'

const Card: FC<{ id: string }> = ({ id }) => {
  const ticket = useSelector<AviasalesAwareState, ReturnType<typeof getTicketByIdSelector>>(state => {
    return getTicketByIdSelector(state, id)
  })

  if (!ticket) {
    return null
  }

  return (
    <pre>
      {id}_{ticket.price}
    </pre>
  )
}

export { Card }
