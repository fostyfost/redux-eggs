import { ISagaModule } from '../../store/saga-extension/contracts'
import { PicsumActionsUnion, PicsumPublicAction } from './action-creators'
import { PICSUM_MODULE_NAME } from './index'
import { picsumReducer } from './reducer'
import { loadPicsumWatcher } from './saga'
import { PicsumAwareState } from './state'

export const getPicsumModule = (): ISagaModule<PicsumAwareState, PicsumActionsUnion> => {
  return {
    id: PICSUM_MODULE_NAME,
    reducerMap: {
      [PICSUM_MODULE_NAME]: picsumReducer,
    },
    initialActions: [PicsumPublicAction.loadPics()],
    sagas: [loadPicsumWatcher],
  }
}
