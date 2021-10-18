import type { Egg } from '@redux-eggs/redux'

import { ChuckNorrisPublicAction } from '@/eggs/chuck-norris/action-creators'
import { CHUCK_NORRIS_REDUCER_KEY, chuckNorrisReducer } from '@/eggs/chuck-norris/reducer'
import { loadChuckNorrisJokeWatcher } from '@/eggs/chuck-norris/saga'

const log = console.log

export const getChuckNorrisEgg = (): Egg => {
  return {
    id: 'chuck-norris',
    reducerMap: {
      [CHUCK_NORRIS_REDUCER_KEY]: chuckNorrisReducer,
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
