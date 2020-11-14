import { put, select, takeEvery, takeLatest } from 'redux-saga/effects'

import { CountReducerAction } from './action-creators'
import { CountActionType } from './action-types'
import { countSelector } from './selectors'

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
