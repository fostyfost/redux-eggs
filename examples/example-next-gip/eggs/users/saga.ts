import { call, put, select, takeLatest } from 'redux-saga/effects'

import { fetchAsJson } from '@/utils/fetchAsJson'

import { UsersReducerAction } from './action-creators'
import { UsersActionType } from './action-types'
import { UsersLoadingState } from './contracts/state'
import type { User } from './contracts/user'
import { errorSelector } from './selectors'

function* loadUsersWorker() {
  yield put(UsersReducerAction.setLoadingState(UsersLoadingState.LOADING))

  const error: ReturnType<typeof errorSelector> = yield select(errorSelector)

  if (error) {
    yield put(UsersReducerAction.setError(undefined))
  }

  try {
    const users: User[] = yield call(fetchAsJson, 'https://jsonplaceholder.typicode.com/users')

    yield put(UsersReducerAction.setUsers(users))
  } catch (error: any) {
    console.error('[Error in `loadUsersWorker`]', error)
    yield put(UsersReducerAction.setError(error.message))
  } finally {
    yield put(UsersReducerAction.setLoadingState(UsersLoadingState.LOADED))
  }
}

export function* loadUsersWatcher() {
  yield takeLatest(UsersActionType.LOAD_USERS, loadUsersWorker)
}
