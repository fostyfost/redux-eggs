import type { Egg } from '@redux-eggs/redux'

import { ChuckNorrisPublicAction } from '@/eggs/chuck-norris/action-creators'

import { chuckNorrisReducer } from './reducer'
import { loadChuckNorrisJokeWatcher } from './saga'

export const CHUCK_NORRIS_MODULE_NAME = 'chuck-norris-egg' as const

const log = console.log

export const getChuckNorrisEgg = (): Egg => {
  return {
    id: CHUCK_NORRIS_MODULE_NAME,
    reducerMap: {
      [CHUCK_NORRIS_MODULE_NAME]: chuckNorrisReducer,
    },
    sagas: [loadChuckNorrisJokeWatcher],
    afterAdd(store) {
      store.dispatch(ChuckNorrisPublicAction.loadJoke())
    },
    afterRemove() {
      log('*** CHUCK NORRIS FOREVER ***')
    },
  }
}
