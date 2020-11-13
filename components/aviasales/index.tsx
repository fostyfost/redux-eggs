import { FC } from 'react'
import { useSelector } from 'react-redux'

import { isTicketsLoadingSelector } from '@/modules/aviasales/selectors'

import { Cards } from './cards'

const Aviasales: FC = () => {
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
