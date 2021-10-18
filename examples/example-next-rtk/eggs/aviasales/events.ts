import mitt from 'mitt'

export const AviasalesEventEmitter = mitt()

export enum AviasalesEvent {
  GET_TICKETS = 'aviasales/GET_TICKETS',
  CHANGE_STOPS = 'aviasales/CHANGE_STOPS',
}

export enum ChangeStopsMassive {
  CHECK_ALL = 'CHECK_ALL',
  UNCHECK_ALL = 'UNCHECK_ALL',
}

export const AviasalesPublicAction = {
  getTickets() {
    AviasalesEventEmitter.emit(AviasalesEvent.GET_TICKETS, AviasalesEvent.GET_TICKETS)
  },
  changeStops(payload: number | ChangeStopsMassive) {
    AviasalesEventEmitter.emit(AviasalesEvent.CHANGE_STOPS, payload)
  },
}
