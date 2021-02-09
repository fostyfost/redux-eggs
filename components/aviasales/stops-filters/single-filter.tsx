import type { FC } from 'react'
import { memo, useCallback } from 'react'

import { Checkbox } from '@/components/aviasales/stops-filters/checkbox'
import { StopsValueToLabelMap } from '@/modules/aviasales/constants'
import { AviasalesEvent, AviasalesEventEmitter } from '@/modules/aviasales/events'

const SingleFilter: FC<{ value: number; checked: boolean }> = memo(({ value, checked }) => {
  const changeHandler = useCallback(() => {
    AviasalesEventEmitter.emit(AviasalesEvent.CHANGE_STOPS, value)
  }, [value])

  return (
    <Checkbox id={`stops-${value}`} label={StopsValueToLabelMap[value]} onChange={changeHandler} checked={checked} />
  )
})

export { SingleFilter }
