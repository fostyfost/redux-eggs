export interface TicketSegment {
  id: string
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
