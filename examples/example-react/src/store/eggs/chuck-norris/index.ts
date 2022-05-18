import type { Egg } from '@redux-eggs/core'

import type { AppStore } from '../../index'
import { loadJoke } from './action-creators'
import { CHUCK_NORRIS_REDUCER_KEY, chuckNorrisReducer } from './reducer'

export const getChuckNorrisEgg = (): Egg<AppStore> => {
  return {
    id: 'chuck-norris',
    reducersMap: {
      [CHUCK_NORRIS_REDUCER_KEY]: chuckNorrisReducer,
    },
    afterAdd(store) {
      store.dispatch(loadJoke())
    },
    afterRemove() {
      console.log('*** CHUCK NORRIS FOREVER ***')
    },
  }
}
