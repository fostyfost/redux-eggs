import { SagaModule } from '../../store/saga-extension/contracts'
import { ChuckNorrisActionsUnion, ChuckNorrisPublicAction } from './action-creators'
import { CHUCK_NORRIS_MODULE_NAME } from './index'
import { chuckNorrisReducer } from './reducer'
import { loadChuckNorrisJokeWatcher } from './saga'
import { ChuckNorrisAwareState } from './state'

export const getChuckNorrisModule = (): SagaModule<ChuckNorrisAwareState, ChuckNorrisActionsUnion> => {
  return {
    id: CHUCK_NORRIS_MODULE_NAME,
    reducerMap: {
      [CHUCK_NORRIS_MODULE_NAME]: chuckNorrisReducer,
    },
    initialActions: [ChuckNorrisPublicAction.loadJoke()],
    sagas: [loadChuckNorrisJokeWatcher],
  }
}
