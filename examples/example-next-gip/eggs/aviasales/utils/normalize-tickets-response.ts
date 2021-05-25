import { nanoid } from 'nanoid'

import { MAX_STOPS, SEGMENTS_LENGTH } from '@/eggs/aviasales/constants'
import type { RawTicket } from '@/eggs/aviasales/contracts/api-response'
import type { TicketsMap, TicketsSegmentsMap } from '@/eggs/aviasales/contracts/state'

interface NormalizationResult {
  ticketsMap: TicketsMap
  ticketsSegmentsMap: TicketsSegmentsMap
}

export const normalizeTicketsResponse = (response: RawTicket[]): NormalizationResult => {
  return response.reduce(
    (acc, rawTicket) => {
      if (rawTicket.segments?.length !== SEGMENTS_LENGTH) {
        return acc
      }

      const segmentsIds: string[] = []
      const stops: number[] = []

      let totalDuration = 0

      rawTicket.segments.forEach(rawSegment => {
        const segmentId = nanoid()

        acc.ticketsSegmentsMap[segmentId] = { ...rawSegment, id: segmentId }

        segmentsIds.push(segmentId)

        stops.push(rawSegment.stops.length)

        totalDuration += rawSegment.duration
      })

      if (stops.some(stop => stop > MAX_STOPS)) {
        return acc
      }

      const ticketId = nanoid()

      acc.ticketsMap[ticketId] = {
        id: ticketId,
        carrier: rawTicket.carrier,
        price: rawTicket.price,
        segmentsIds: [segmentsIds[0], segmentsIds[1]],
        stops: [stops[0], stops[1]],
        totalDuration,
      }

      return acc
    },
    { ticketsMap: {}, ticketsSegmentsMap: {} } as NormalizationResult,
  )
}
