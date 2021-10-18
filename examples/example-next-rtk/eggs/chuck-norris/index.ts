import type { Egg } from '@redux-eggs/redux-toolkit'

import { loadChuckNorrisJokeWatcher } from '@/eggs/chuck-norris/saga'
import { CHUCK_NORRIS_SLICE, ChuckNorrisPublicAction, chuckNorrisReducer } from '@/eggs/chuck-norris/slice'

const log = console.log

export const getChuckNorrisEgg = (): Egg => {
  return {
    id: 'chuck-norris',
    reducerMap: {
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
