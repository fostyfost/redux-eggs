import { delay, put, takeLatest } from 'redux-saga/effects'

import { ClockPublicAction, ClockReducerAction } from './action-creators'
import { ClockActionType } from './action-types'

function* clockWorker() {
  while (true) {
    yield put(ClockReducerAction.tickClock())
    yield delay(1000)
  }
}

export function* startClockWatcher() {
  if (typeof window === 'undefined') {
    yield put(ClockReducerAction.tickClock())
    return
  }

  if (process.env.NEXT_PUBLIC_USE_CLOCK_WORKER === 'true') {
    yield takeLatest(ClockActionType.START_CLOCK, clockWorker)
    yield put(ClockPublicAction.startClock())
  }
}
