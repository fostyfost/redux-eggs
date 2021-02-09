import type { SagaModule } from '@/store/saga-extension/contracts'

import type { PicsumActionsUnion } from './action-creators'
import { PicsumPublicAction } from './action-creators'
import type { PicsumAwareState } from './contracts/state'
import { PICSUM_MODULE_NAME } from './index'
import { picsumReducer } from './reducer'
import { loadPicsumWatcher } from './saga'

export const getPicsumModule = (): SagaModule<PicsumAwareState, PicsumActionsUnion> => {
  return {
    id: PICSUM_MODULE_NAME,
    reducerMap: {
      [PICSUM_MODULE_NAME]: picsumReducer,
    },
    initialActions: [PicsumPublicAction.loadPics()],
    sagas: [loadPicsumWatcher],
  }
}
