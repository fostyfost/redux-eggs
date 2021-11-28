import { nanoid } from 'nanoid'

import { normalizeTicketsResponse } from '@/eggs/aviasales/utils/normalize-tickets-response'

jest.mock('nanoid')

afterAll(() => {
  ;(nanoid as any).mockRestore()
})

describe('`normalizeTicketsResponse` tests', () => {
  test('should work', () => {
    let id = 0

    ;(nanoid as any).mockImplementation(() => String(++id))

    const result = normalizeTicketsResponse([
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
    ])

    expect(result).toEqual({
      ticketsMap: {
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
      },
      ticketsSegmentsMap: {
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
      },
    })
  })
})
