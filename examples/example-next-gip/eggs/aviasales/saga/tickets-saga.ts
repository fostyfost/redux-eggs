import type { Handler } from 'mitt'
import type { Subscribe } from 'redux-saga'
import { buffers, eventChannel } from 'redux-saga'
import { call, put, race, select, take } from 'redux-saga/effects'

import { AviasalesReducerAction } from '@/eggs/aviasales/action-creators'
import { AviasalesLoadingState } from '@/eggs/aviasales/contracts/loading-state'
import { AviasalesEvent, AviasalesEventEmitter } from '@/eggs/aviasales/events'
import { getTickets } from '@/eggs/aviasales/saga/get-tickets'
import { isAllTicketLoadedSelector } from '@/eggs/aviasales/selectors'
import { StoreActionType } from '@/store/action-types'

type ChannelPayload = string

const subscribe: Subscribe<ChannelPayload> = emitter => {
  const handler: Handler<ChannelPayload> = payload => {
    if (typeof payload !== 'undefined') {
      emitter(payload)
    }
  }

  AviasalesEventEmitter.on(AviasalesEvent.GET_TICKETS, handler)

  // Unsubscribe
  return (): void => {
    AviasalesEventEmitter.off(AviasalesEvent.GET_TICKETS, handler)
  }
}

export function* ticketsSaga() {
  let channel

  if (typeof window !== 'undefined') {
    channel = eventChannel<ChannelPayload>(subscribe, buffers.sliding(1))

    // На клиенте дождемся наступления гидратации или события в канале
    yield race([take(StoreActionType.HYDRATE), take(channel)])
  }

  const isLoaded: ReturnType<typeof isAllTicketLoadedSelector> = yield select(isAllTicketLoadedSelector)

  if (!isLoaded) {
    try {
      yield call(getTickets)
    } catch (error) {
      console.error('[Error in `ticketsSaga`]', error)
      yield put(AviasalesReducerAction.setLoadingState(AviasalesLoadingState.LOADED))
    } finally {
      if (channel) {
        channel.close()
      }
    }
  }
}
