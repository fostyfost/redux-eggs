import { nanoid } from 'nanoid'
import { call, delay, put, retry, select } from 'redux-saga/effects'

import { AviasalesReducerAction } from './action-creators'
import { getSearchIdWithApi } from './api/getSearchIdWithApi'
import { getTicketsWithApi } from './api/getTicketsWithApi'
import { SearchResponse, TicketsResponse } from './contracts/api-response'
import { AviasalesLoadingState, TicketsMap } from './contracts/state'
import { Ticket } from './contracts/ticket'
import { isAllTicketLoadedSelector, searchIdSelector } from './selectors'

const DELAY_DURATION = 500

const isServer = typeof window === 'undefined'

function* getTickets() {
  let stop = false

  yield put(AviasalesReducerAction.setLoadingState(AviasalesLoadingState.LOADING))

  const searchId = yield call(getSearchId)

  while (!stop) {
    // It's long-polling api.
    // We receive data until the response contains a stop field with true as a value.
    const res: TicketsResponse = yield retry(3, DELAY_DURATION, getTicketsWithApi, searchId)

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
      yield delay(DELAY_DURATION)
    }
  }
}

function* getSearchId() {
  const savedSearchId: string | undefined = yield select(searchIdSelector)
  if (savedSearchId) {
    return savedSearchId
  }

  const res: SearchResponse = yield retry(3, 500, getSearchIdWithApi)

  yield put(AviasalesReducerAction.setSearchId(res.searchId))

  return res.searchId
}

export function* aviasalesSaga() {
  const isLoaded = yield select(isAllTicketLoadedSelector)
  if (isLoaded) {
    return
  }

  try {
    yield call(getTickets)
  } catch (error) {
    console.error('[Error in `aviasalesSaga`]', error)
    yield put(AviasalesReducerAction.setLoadingState(AviasalesLoadingState.LOADED))
  }
}
