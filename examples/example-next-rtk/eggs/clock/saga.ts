import { delay, put, takeLatest } from 'typed-redux-saga'

import { ClockPublicAction, ClockReducerAction } from '@/eggs/clock/slice'

function* clockWorker() {
  while (true) {
    yield* put(ClockReducerAction.tickClock(Date.now()))
    yield* delay(1000)
  }
}

export function* startClockWatcher() {
  if (typeof window === 'undefined') {
    yield* put(ClockReducerAction.tickClock(Date.now()))
    return
  }

  yield* takeLatest(ClockPublicAction.startClock, clockWorker)
  yield* put(ClockPublicAction.startClock())
}
