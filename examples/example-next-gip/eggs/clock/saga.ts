import { delay, put, takeLatest } from 'redux-saga/effects'

import { ClockPublicAction, ClockReducerAction } from '@/eggs/clock/action-creators'
import { ClockActionType } from '@/eggs/clock/action-types'

function* clockWorker() {
  while (true) {
    yield put(ClockReducerAction.tickClock(Date.now()))
    yield delay(1000)
  }
}

export function* startClockWatcher() {
  if (typeof window === 'undefined') {
    yield put(ClockReducerAction.tickClock(Date.now()))
    return
  }

  yield takeLatest(ClockActionType.START_CLOCK, clockWorker)
  yield put(ClockPublicAction.startClock())
}
