export interface Ticket {
  id: string
  // Цена в рублях
  price: number
  // Код авиакомпании (iata)
  carrier: string
  // Массив ссылок на перелёты.
  segmentsIds: [string, string]
  // Общая продолжительность всех полётов в минутах
  totalDuration: number
  // Общее количество пересадок "туда" и общее количество пересадок "обратно"
  stops: [number, number]
}
