import type { FC } from 'react'
import { shallowEqual, useSelector } from 'react-redux'

import { Card } from '@/components/aviasales/cards/card'
import styles from '@/components/aviasales/cards/index.module.css'
import type { AviasalesAwareState } from '@/eggs/aviasales/contracts/state'
import { isAllTicketLoadedSelector, ticketsIdsSelector } from '@/eggs/aviasales/selectors'

interface SelectorResult {
  ids: ReturnType<typeof ticketsIdsSelector>
  isLoaded: ReturnType<typeof isAllTicketLoadedSelector>
}

const Cards: FC = () => {
  const { ids, isLoaded } = useSelector<AviasalesAwareState, SelectorResult>(state => {
    return {
      ids: ticketsIdsSelector(state),
      isLoaded: isAllTicketLoadedSelector(state),
    }
  }, shallowEqual)

  if (!ids.length && isLoaded) {
    return <div className={styles.notFound}>Здесь слишком недоперефильтровано, давайте проветрим?</div>
  }

  return (
    <ul className={styles.cardsList}>
      {ids.map(id => (
        <li key={id} className={styles.listItem}>
          <Card id={id} />
        </li>
      ))}
    </ul>
  )
}

export { Cards }
