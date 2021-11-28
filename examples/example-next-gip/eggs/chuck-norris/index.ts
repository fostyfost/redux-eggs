import type { Egg } from '@redux-eggs/core'

import { ChuckNorrisPublicAction } from '@/eggs/chuck-norris/action-creators'
import { CHUCK_NORRIS_REDUCER_KEY, chuckNorrisReducer } from '@/eggs/chuck-norris/reducer'
import { loadChuckNorrisJokeWatcher } from '@/eggs/chuck-norris/saga'
import type { AppStore } from '@/store'

const log = console.log

export const getChuckNorrisEgg = (): Egg<AppStore> => {
  return {
    id: 'chuck-norris',
    reducersMap: {
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
