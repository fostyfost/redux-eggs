import { all, call, delay, put, retry } from 'redux-saga/effects'

import type { YieldReturnType } from '@/@types/redux-saga-call-effect-return-type'
import { AviasalesReducerAction } from '@/modules/aviasales/action-creators'
import { getTicketsWithApi } from '@/modules/aviasales/api/getTicketsWithApi'
import { DELAY_LENGTH, MAX_TRIES } from '@/modules/aviasales/constants'
import { AviasalesLoadingState } from '@/modules/aviasales/contracts/loading-state'
import { getSearchId } from '@/modules/aviasales/saga/getSearchId'
import { normalizeTicketsResponse } from '@/modules/aviasales/utils/normalize-tickets-response'

const isServer = typeof window === 'undefined'

export function* getTickets() {
  let stop = false

  yield put(AviasalesReducerAction.setLoadingState(AviasalesLoadingState.LOADING))

  const searchId: YieldReturnType<typeof getSearchId> = yield call(getSearchId)

  while (!stop) {
    // It's long-polling api.
    // We receive data until the response contains a stop field with true as a value.
    // TODO: Add cancellation
    const res: YieldReturnType<typeof getTicketsWithApi> = yield retry(
      MAX_TRIES,
      DELAY_LENGTH,
      getTicketsWithApi,
      searchId,
    )

    const { ticketsSegmentsMap, ticketsMap }: YieldReturnType<typeof normalizeTicketsResponse> = yield call(
      normalizeTicketsResponse,
      res.tickets,
    )

    yield all([
      put(AviasalesReducerAction.addTicketsSegments(ticketsSegmentsMap)),
      put(AviasalesReducerAction.addTickets(ticketsMap)),
    ])

    stop = res.stop || isServer

    if (res.stop) {
      yield put(AviasalesReducerAction.setLoadingState(AviasalesLoadingState.LOADED))
    } else if (!isServer) {
      yield delay(DELAY_LENGTH)
    }
  }
}
