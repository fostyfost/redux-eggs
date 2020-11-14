import clsx from 'clsx'
import Image from 'next/image'
import { FC, memo } from 'react'
import { useSelector } from 'react-redux'

import styles from '@/components/aviasales/cards/card.module.css'
import { Segment } from '@/components/aviasales/cards/segment'
import { AviasalesAwareState } from '@/modules/aviasales/contracts/state'
import { getTicketByIdSelector } from '@/modules/aviasales/selectors'

const buildIataSrc = (code: string, options = { width: 99, height: 36 }): string => {
  return `https://pics.avs.io/${options.width}/${options.height}/${code}.png`
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU').format(price)
}

const Card: FC<{ id: string }> = memo(({ id }) => {
  const ticket = useSelector<AviasalesAwareState, ReturnType<typeof getTicketByIdSelector>>(state => {
    return getTicketByIdSelector(state, id)
  })

  if (!ticket) {
    return null
  }

  return (
    <article className={styles.container}>
      <div className={clsx(styles.row, styles.head)}>
        <div className={styles.col}>
          <span className={styles.price}>{formatPrice(ticket.price)} Р</span>
        </div>
        <div className={clsx(styles.col, styles.image)}>
          <Image
            src={buildIataSrc(ticket.carrier)}
            title={ticket.carrier}
            alt={ticket.carrier}
            width={99}
            height={36}
            loading='lazy'
          />
        </div>
      </div>
      <div className={styles.segmentsContainer}>
        {ticket.segmentsIds.map(segmentId => (
          <Segment key={segmentId} id={segmentId} />
        ))}
      </div>
    </article>
  )
})

export { Card }
