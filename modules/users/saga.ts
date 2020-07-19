import { call, delay, put, takeLatest } from 'redux-saga/effects'

import { fetchAsJson } from '../../utils/fetchAsJson'
import { UsersReducerAction } from './action-creators'
import { UsersActionType } from './action-types'
import { UsersLoadingState } from './contracts/state'
import { User } from './contracts/user'

function* loadUsersWorker() {
  yield put(UsersReducerAction.setLoadingState(UsersLoadingState.LOADING))

  yield delay(1000)

  try {
    const users: User[] = yield call(fetchAsJson, 'https://jsonplaceholder.typicode.com/users')

    yield put(UsersReducerAction.setUsers(users))
  } catch (err) {
    yield put(UsersReducerAction.setError(err.message))
  } finally {
    yield put(UsersReducerAction.setLoadingState(UsersLoadingState.LOADED))
  }
}

export function* loadUsersWatcher() {
  yield takeLatest(UsersActionType.LOAD_USERS, loadUsersWorker)
}
