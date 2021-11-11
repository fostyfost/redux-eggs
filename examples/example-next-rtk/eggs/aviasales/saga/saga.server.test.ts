/**
 * @jest-environment node
 */

import { combineReducers, nanoid } from '@reduxjs/toolkit'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { dynamic } from 'redux-saga-test-plan/providers'

import * as api from '@/eggs/aviasales/api/getTicketsWithApi'
import { DEFAULT_SORT, DEFAULT_STOPS } from '@/eggs/aviasales/constants'
import type { TicketsResponse } from '@/eggs/aviasales/contracts/api-response'
import { AviasalesLoadingState } from '@/eggs/aviasales/contracts/loading-state'
import type { TicketsMap, TicketsSegmentsMap } from '@/eggs/aviasales/contracts/state'
import { aviasalesSaga } from '@/eggs/aviasales/saga'
import { filterSaga } from '@/eggs/aviasales/saga/filter-saga'
import { getSearchId } from '@/eggs/aviasales/saga/getSearchId'
import { AVIASALES_SLICE, aviasalesReducer, AviasalesReducerAction } from '@/eggs/aviasales/slice'

jest.mock('nanoid')

afterAll(() => {
  // @ts-ignore
  nanoid.mockRestore()
})

const response: TicketsResponse = {
  tickets: [
    {
      price: 38006,
      carrier: 'S7',
      segments: [
        {
          origin: 'MOW',
          destination: 'HKT',
          date: '2020-11-19T15:52:00.000Z',
          stops: ['HKG', 'SHA', 'DXB'],
          duration: 1813,
        },
        {
          origin: 'HKT',
          destination: 'MOW',
          date: '2020-12-09T04:39:00.000Z',
          stops: ['DXB', 'BKK'],
          duration: 960,
        },
      ],
    },
    {
      price: 45694,
      carrier: 'S7',
      segments: [
        {
          origin: 'MOW',
          destination: 'HKT',
          date: '2020-11-18T23:04:00.000Z',
          stops: ['KUL', 'HKG'],
          duration: 907,
        },
        {
          origin: 'HKT',
          destination: 'MOW',
          date: '2020-12-08T22:24:00.000Z',
          stops: ['DXB', 'BKK', 'IST'],
          duration: 1706,
        },
      ],
    },
  ],
  stop: false,
}

const tickets: TicketsMap = {
  '3': {
    carrier: 'S7',
    id: '3',
    price: 38006,
    segmentsIds: ['1', '2'],
    stops: [3, 2],
    totalDuration: 2773,
  },
  '6': {
    carrier: 'S7',
    id: '6',
    price: 45694,
    segmentsIds: ['4', '5'],
    stops: [2, 3],
    totalDuration: 2613,
  },
}

const ticketsSegments: TicketsSegmentsMap = {
  '1': {
    date: '2020-11-19T15:52:00.000Z',
    destination: 'HKT',
    duration: 1813,
    id: '1',
    origin: 'MOW',
    stops: ['HKG', 'SHA', 'DXB'],
  },
  '2': {
    date: '2020-12-09T04:39:00.000Z',
    destination: 'MOW',
    duration: 960,
    id: '2',
    origin: 'HKT',
    stops: ['DXB', 'BKK'],
  },
  '4': {
    date: '2020-11-18T23:04:00.000Z',
    destination: 'HKT',
    duration: 907,
    id: '4',
    origin: 'MOW',
    stops: ['KUL', 'HKG'],
  },
  '5': {
    date: '2020-12-08T22:24:00.000Z',
    destination: 'MOW',
    duration: 1706,
    id: '5',
    origin: 'HKT',
    stops: ['DXB', 'BKK', 'IST'],
  },
}

const clone = (obj: any) => JSON.parse(JSON.stringify(obj))

describe('`aviasalesSaga` tests', () => {
  test('Saga should get tickets one time', async () => {
    let id = 0

    // @ts-ignore
    nanoid.mockImplementation(() => String(++id))

    let count = 0

    const retryTester = jest.fn()

    const provideGetTicketsWithApi = () => {
      count++

      retryTester()

      if (count < 3) {
        throw new Error('some error occurred')
      }

      return response
    }

    await expectSaga(aviasalesSaga)
      .provide([
        [matchers.call.fn(getSearchId), 'test'],
        [matchers.call.fn(api.getTicketsWithApi), dynamic(provideGetTicketsWithApi)],
      ])
      .withReducer(
        combineReducers({
          [AVIASALES_SLICE]: aviasalesReducer,
        }),
        {
          [AVIASALES_SLICE]: {
            tickets: {},
            ticketsSegments: {},
            loadingState: AviasalesLoadingState.NEVER,
            currentSort: DEFAULT_SORT,
            stops: DEFAULT_STOPS,
          },
        },
      )
      .not.fork.like({ fn: filterSaga })
      .put(AviasalesReducerAction.setLoadingState(AviasalesLoadingState.LOADING))
      .put(AviasalesReducerAction.addTicketsSegments(clone(ticketsSegments)))
      .put(AviasalesReducerAction.addTickets(clone(tickets)))
      .hasFinalState({
        [AVIASALES_SLICE]: {
          tickets,
          ticketsSegments,
          loadingState: AviasalesLoadingState.LOADING,
          currentSort: DEFAULT_SORT,
          stops: DEFAULT_STOPS,
        },
      })
      .silentRun()

    expect(retryTester).toHaveBeenCalledTimes(3)
  })
})
