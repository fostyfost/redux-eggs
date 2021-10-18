import { put, select, takeEvery, takeLatest } from 'redux-saga/effects'

import { CountReducerAction } from '@/eggs/count/action-creators'
import { CountActionType } from '@/eggs/count/action-types'
import { countSelector } from '@/eggs/count/selectors'

function* incrementWorker() {
  let count: ReturnType<typeof countSelector> = yield select(countSelector)

  count += 1

  yield put(CountReducerAction.setCount(count))
}

function* decrementWatcher() {
  let count: ReturnType<typeof countSelector> = yield select(countSelector)

  count -= 1

  if (count >= 0) {
    yield put(CountReducerAction.setCount(count))
  }
}

function* resetWatcher() {
  yield put(CountReducerAction.setCount(0))
}

export function* countWatcher() {
  yield takeEvery(CountActionType.INCREMENT, incrementWorker)
  yield takeEvery(CountActionType.DECREMENT, decrementWatcher)
  yield takeLatest(CountActionType.RESET, resetWatcher)
}
