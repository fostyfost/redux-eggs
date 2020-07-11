import { call, delay, put, select } from 'redux-saga/effects'

import { AviasalesReducerAction } from './action-creators'
import { isAllTicketLoadedSelector, searchIdSelector } from './selectors'
import { SearchResponse, TicketsResponse } from './contracts/api-response'
import { fetchAsJson } from '../../utils/fetchAsJson'
import { AviasalesLoadingState, TicketsMap } from './contracts/state'
import { Ticket } from './contracts/ticket'
import { nanoid } from 'nanoid'

function* getTickets() {
  let stop = false

  const isServer = typeof window === 'undefined'

  yield put(AviasalesReducerAction.setLoadingState(AviasalesLoadingState.LOADING))

  const searchId = yield call(getSearchId)

  while (!stop) {
    // It's long-polling api.
    // We receive data until the response contains a stop field with true as a value.
    const res: TicketsResponse = yield call(
      fetchAsJson,
      `https://front-test.beta.aviasales.ru/tickets?searchId=${searchId}`,
    )

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
      yield delay(1000)
    }
  }
}

function* getSearchId() {
  const savedSearchId: string | undefined = yield select(searchIdSelector)
  if (savedSearchId) {
    return savedSearchId
  }

  const res: SearchResponse = yield call(fetchAsJson, 'https://front-test.beta.aviasales.ru/search')

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
    console.log('[Error in `searchWorker`]', error)
    yield put(AviasalesReducerAction.setLoadingState(AviasalesLoadingState.LOADED))
  }
}
