import { put, takeLatest, delay } from 'redux-saga/effects'
import es6promise from 'es6-promise'
import { UsersReducerAction } from './action-creators'
import { UsersActionType } from './action-types'
import { UsersLoadingState } from './state'

es6promise.polyfill()

function* loadUsersWorker() {
  yield put(UsersReducerAction.setLoadingState(UsersLoadingState.LOADING))

  yield delay(1000)

  try {
    const res = yield fetch('https://jsonplaceholder.typicode.com/users')

    const users = yield res.json()

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
