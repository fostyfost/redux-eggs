import { nanoid } from 'nanoid'
import { call, delay, put, retry, select, takeLeading } from 'redux-saga/effects'

import { AviasalesPublicAction, AviasalesReducerAction } from '@/modules/aviasales/action-creators'
import { AviasalesActionType } from '@/modules/aviasales/action-types'
import { getTicketsWithApi } from '@/modules/aviasales/api/getTicketsWithApi'
import { DELAY_LENGTH, MAX_TRIES } from '@/modules/aviasales/constants'
import { TicketsResponse } from '@/modules/aviasales/contracts/api-response'
import { AviasalesLoadingState, TicketsMap } from '@/modules/aviasales/contracts/state'
import { Ticket } from '@/modules/aviasales/contracts/ticket'
import { getSearchId } from '@/modules/aviasales/saga/getSearchId'
import { isAllTicketLoadedSelector } from '@/modules/aviasales/selectors'
import { isSortValid } from '@/modules/aviasales/utils/validate-sort'

const isServer = typeof window === 'undefined'

function* getTickets() {
  let stop = false

  yield put(AviasalesReducerAction.setLoadingState(AviasalesLoadingState.LOADING))

  const searchId = yield call(getSearchId)

  while (!stop) {
    // It's long-polling api.
    // We receive data until the response contains a stop field with true as a value.
    // TODO: Add cancellation
    const res: TicketsResponse = yield retry(MAX_TRIES, DELAY_LENGTH, getTicketsWithApi, searchId)

    yield put(
      AviasalesReducerAction.addTickets(
        res.tickets.reduce((acc: TicketsMap, ticket: Ticket) => {
          acc[nanoid()] = ticket
          return acc
        }, {} as TicketsMap),
      ),
    )

    stop = res.stop || isServer

    if (res.stop) {
      yield put(AviasalesReducerAction.setLoadingState(AviasalesLoadingState.LOADED))
    } else if (!isServer) {
      yield delay(DELAY_LENGTH)
    }
  }
}

export function* aviasalesSaga() {
  yield takeLeading(AviasalesActionType.GET_TICKETS, function* worker(
    action: ReturnType<typeof AviasalesPublicAction.getTickets>,
  ) {
    if (isSortValid(action.payload.sort)) {
      // yield call(batch())
    }

    const isLoaded: ReturnType<typeof isAllTicketLoadedSelector> = yield select(isAllTicketLoadedSelector)

    if (!isLoaded) {
      try {
        yield call(getTickets)
      } catch (error) {
        console.error('[Error in `aviasalesSaga`]', error)
        yield put(AviasalesReducerAction.setLoadingState(AviasalesLoadingState.LOADED))
      }
    }
  })
}
