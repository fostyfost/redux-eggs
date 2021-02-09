import type { FC } from 'react'
import { useSelector } from 'react-redux'

import { AllFilters } from '@/components/aviasales/stops-filters/all-filters'
import styles from '@/components/aviasales/stops-filters/index.module.css'
import { SingleFilter } from '@/components/aviasales/stops-filters/single-filter'
import { AVAILABLE_STOPS } from '@/modules/aviasales/constants'
import { stopsSelector } from '@/modules/aviasales/selectors'

const SingleFilters: FC = () => {
  const stops = useSelector(stopsSelector)

  return (
    <>
      {AVAILABLE_STOPS.map(value => (
        <SingleFilter key={value} value={value} checked={stops.includes(value)} />
      ))}
    </>
  )
}

const StopsFilters: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.label}>Количество пересадок</div>
      <AllFilters />
      <SingleFilters />
    </div>
  )
}

export { StopsFilters }
