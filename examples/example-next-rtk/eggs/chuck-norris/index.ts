import type { Egg } from '@redux-eggs/core'

import { loadChuckNorrisJokeWatcher } from '@/eggs/chuck-norris/saga'
import { CHUCK_NORRIS_SLICE, ChuckNorrisPublicAction, chuckNorrisReducer } from '@/eggs/chuck-norris/slice'
import type { AppStore } from '@/store'

const log = console.log

export const getChuckNorrisEgg = (): Egg<AppStore> => {
  return {
    id: 'chuck-norris',
    reducersMap: {
      [CHUCK_NORRIS_SLICE]: chuckNorrisReducer,
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
