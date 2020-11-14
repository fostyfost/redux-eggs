import { put, retry, select } from 'redux-saga/effects'

import { AviasalesReducerAction } from '@/modules/aviasales/action-creators'
import { getSearchIdWithApi } from '@/modules/aviasales/api/getSearchIdWithApi'
import { DELAY_LENGTH, MAX_TRIES } from '@/modules/aviasales/constants'
import { SearchResponse } from '@/modules/aviasales/contracts/api-response'
import { searchIdSelector } from '@/modules/aviasales/selectors'

export function* getSearchId() {
  const savedSearchId: ReturnType<typeof searchIdSelector> = yield select(searchIdSelector)

  if (savedSearchId) {
    return savedSearchId
  }

  // TODO: Add cancellation
  const res: SearchResponse = yield retry(MAX_TRIES, DELAY_LENGTH, getSearchIdWithApi)

  yield put(AviasalesReducerAction.setSearchId(res.searchId))

  return res.searchId
}
