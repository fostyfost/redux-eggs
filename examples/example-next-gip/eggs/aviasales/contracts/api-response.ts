export interface SearchResponse {
  searchId: string
}

export interface TicketsResponse {
  tickets: RawTicket[]
  stop: boolean
}

export interface RawTicketSegment {
  // City code (iata)
  origin: string
  // City code (iata)
  destination: string
  // Дата и время вылета туда
  date: string
  // Массив кодов (iata) городов с пересадками
  stops: string[]
  // Общее время перелёта в минутах
  duration: number
}

export interface RawTicket {
  // Цена в рублях
  price: number
  // Код авиакомпании (iata)
  carrier: string
  // Массив перелётов.
  // В тестовом задании это всегда поиск "туда-обратно" значит состоит из двух элементов
  segments: [RawTicketSegment, RawTicketSegment]
}
