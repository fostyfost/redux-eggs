import { fork } from 'redux-saga/effects'

import { filterSaga } from '@/modules/aviasales/saga/filter-saga'
import { ticketsSaga } from '@/modules/aviasales/saga/tickets-saga'

export function* aviasalesSaga() {
  if (typeof window !== 'undefined') {
    yield fork(filterSaga)
  }

  yield fork(ticketsSaga)
}
