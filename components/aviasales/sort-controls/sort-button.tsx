import { FC, memo, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import styles from '@/components/aviasales/sort-controls/sort-button.module.css'
import { AviasalesReducerAction } from '@/modules/aviasales/action-creators'
import { Sort } from '@/modules/aviasales/contracts/sort'

const ValueToLabelMap = {
  [Sort.CHEAPEST]: 'Самый дешевый',
  [Sort.FASTEST]: 'Самый быстрый',
}

const SortButton: FC<{ value: Sort; checked: boolean }> = memo(({ value, checked }) => {
  const dispatch = useDispatch()

  const changeHandler = useCallback(() => {
    dispatch(AviasalesReducerAction.setCurrentSort(value))
  }, [dispatch, value])

  const id = `sort-${value}`

  return (
    <>
      <input id={id} type='radio' name='sort' checked={checked} onChange={changeHandler} className={styles.input} />
      <label htmlFor={id} className={styles.label}>
        {ValueToLabelMap[value]}
      </label>
    </>
  )
})

export { SortButton }
