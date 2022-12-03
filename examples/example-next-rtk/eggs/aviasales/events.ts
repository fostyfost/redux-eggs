import mitt from 'mitt'

export enum AviasalesEvent {
  GET_TICKETS = 'aviasales/GET_TICKETS',
  CHANGE_STOPS = 'aviasales/CHANGE_STOPS',
}

export enum ChangeStopsMassive {
  CHECK_ALL = 'CHECK_ALL',
  UNCHECK_ALL = 'UNCHECK_ALL',
}

type MittEvents = {
  [AviasalesEvent.GET_TICKETS]: string
  [AviasalesEvent.CHANGE_STOPS]: number | ChangeStopsMassive
}

export const AviasalesEventEmitter = mitt<MittEvents>()

export const AviasalesPublicAction = {
  getTickets() {
    AviasalesEventEmitter.emit(AviasalesEvent.GET_TICKETS, AviasalesEvent.GET_TICKETS)
  },
  changeStops(payload: number | ChangeStopsMassive) {
    AviasalesEventEmitter.emit(AviasalesEvent.CHANGE_STOPS, payload)
  },
}
