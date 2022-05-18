import { put, select, takeEvery, takeLatest } from 'redux-saga/effects'

import { countSelector } from '@/eggs/count/selectors'
import { CountPublicAction, CountReducerAction } from '@/eggs/count/slice'

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
  yield takeEvery(CountPublicAction.increment, incrementWorker)
  yield takeEvery(CountPublicAction.decrement, decrementWatcher)
  yield takeLatest(CountPublicAction.reset, resetWatcher)
}
