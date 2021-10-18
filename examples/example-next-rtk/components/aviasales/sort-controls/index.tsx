import type { FC } from 'react'
import { useSelector } from 'react-redux'

import styles from '@/components/aviasales/sort-controls/index.module.css'
import { SortButton } from '@/components/aviasales/sort-controls/sort-button'
import { ALLOWED_SORTS } from '@/eggs/aviasales/constants'
import type { AviasalesAwareState } from '@/eggs/aviasales/contracts/state'
import { currentSortSelector } from '@/eggs/aviasales/selectors'

const SortControls: FC = () => {
  const currentSort = useSelector<AviasalesAwareState, ReturnType<typeof currentSortSelector>>(currentSortSelector)

  return (
    <div className={styles.container}>
      {ALLOWED_SORTS.map(value => (
        <SortButton key={value} value={value} checked={value === currentSort} />
      ))}
    </div>
  )
}

export { SortControls }
