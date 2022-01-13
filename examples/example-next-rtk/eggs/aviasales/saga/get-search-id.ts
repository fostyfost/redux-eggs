import { put, retry, select } from 'typed-redux-saga'

import { getSearchIdWithApi } from '@/eggs/aviasales/api/get-search-id-with-api'
import { DELAY_LENGTH, MAX_TRIES } from '@/eggs/aviasales/constants'
import { searchIdSelector } from '@/eggs/aviasales/selectors'
import { AviasalesReducerAction } from '@/eggs/aviasales/slice'

export function* getSearchId() {
  const savedSearchId = yield* select(searchIdSelector)

  if (savedSearchId) {
    return savedSearchId
  }

  // TODO: Add cancellation
  const res = yield* retry(MAX_TRIES, DELAY_LENGTH, getSearchIdWithApi)

  yield* put(AviasalesReducerAction.setSearchId(res.searchId))

  return res.searchId
}
