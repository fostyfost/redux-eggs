import React from 'react'
import { Cards } from './cards'
import { useSelector } from 'react-redux'
import { isTicketsLoadingSelector } from '../../modules/aviasales/selectors'

const Aviasales = () => {
  const isLoading = useSelector(isTicketsLoadingSelector)

  return (
    <div>
      {isLoading && <p>Loading ...</p>}
      <Cards />
      {isLoading && <p>Loading ...</p>}
    </div>
  )
}

export { Aviasales }
