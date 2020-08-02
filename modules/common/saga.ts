import { put } from 'redux-saga/effects'

import { XkcdPublicAction } from '../xkcd/action-creators'

export function* commonSaga() {
  if (typeof window === 'undefined') {
    yield put(XkcdPublicAction.loadInfo())
  }
}
