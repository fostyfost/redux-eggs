import clsx from 'clsx'
import dayjs from 'dayjs'
import type { FC } from 'react'
import { memo } from 'react'
import { useSelector } from 'react-redux'

import commonStyles from '@/components/aviasales/cards/card.module.css'
import styles from '@/components/aviasales/cards/segment.module.css'
import { StopsValueToLabelMap } from '@/eggs/aviasales/constants'
import type { AviasalesAwareState } from '@/eggs/aviasales/contracts/state'
import { getTicketSegmentByIdSelector } from '@/eggs/aviasales/selectors'

const ROUTE_DATE_FORMAT = 'HH:mm'

const getHumanRouteDates = (date: string, durationInMinutes: number): { from: string; to: string } | undefined => {
  const dayJsObject = dayjs(date)

  if (!dayJsObject.isValid()) {
    return undefined
  }

  return {
    from: dayJsObject.format(ROUTE_DATE_FORMAT),
    to: dayJsObject.add(durationInMinutes, 'minute').format(ROUTE_DATE_FORMAT),
  }
}

const minutesConverter = (durationInMinutes: number): { hours: number; minutes: number } => {
  const hours = durationInMinutes / 60
  const roundedHours = Math.floor(hours)

  return {
    hours: roundedHours,
    minutes: Math.round((hours - roundedHours) * 60),
  }
}

const getHumanDuration = (durationInMinutes: number): string => {
  const { hours, minutes } = minutesConverter(durationInMinutes)

  const duration = []

  if (minutes) {
    duration.push(`${minutes}м`)
  }

  if (hours) {
    duration.unshift(`${hours}ч`)

    if (!minutes) {
      duration.push('0м')
    }
  }

  return duration.join(' ')
}

const Segment: FC<{ id: string }> = memo(({ id }) => {
  const segment = useSelector<AviasalesAwareState, ReturnType<typeof getTicketSegmentByIdSelector>>(state => {
    return getTicketSegmentByIdSelector(state, id)
  })

  if (!segment) {
    return null
  }

  const routeDates = getHumanRouteDates(segment.date, segment.duration)
  const duration = getHumanDuration(segment.duration)

  return (
    <div className={commonStyles.row}>
      <div className={commonStyles.col}>
        <div className={clsx(styles.text, styles.key)}>
          {segment.origin} &ndash; {segment.destination}
        </div>
        {routeDates ? (
          <div className={clsx(styles.text, styles.value)}>
            {routeDates.from} &ndash; {routeDates.to}
          </div>
        ) : null}
      </div>

      {duration ? (
        <div className={commonStyles.col}>
          <div className={clsx(styles.text, styles.key)}>В пути</div>
          <div className={clsx(styles.text, styles.value)}>{duration}</div>
        </div>
      ) : null}

      <div className={commonStyles.col}>
        <div className={clsx(styles.text, styles.key)}>{StopsValueToLabelMap[segment.stops.length]}</div>
        {segment.stops.length ? (
          <div className={clsx(styles.text, styles.value)}>{segment.stops.join(', ')}</div>
        ) : null}
      </div>
    </div>
  )
})

export { Segment }
