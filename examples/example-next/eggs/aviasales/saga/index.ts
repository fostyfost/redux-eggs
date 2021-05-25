import { fork } from 'redux-saga/effects'

import { filterSaga } from '@/eggs/aviasales/saga/filter-saga'
import { ticketsSaga } from '@/eggs/aviasales/saga/tickets-saga'

export function* aviasalesSaga() {
  if (typeof window !== 'undefined') {
    yield fork(filterSaga)
  }

  yield fork(ticketsSaga)
}
