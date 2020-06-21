import { ISagaModule } from '../../store/saga-extension/contracts'
import { XkcdActionsUnion } from './action-creators'
import { XKCD_MODULE_NAME } from './index'
import { xkcdReducer } from './reducer'
import { loadXkcdInfoWatcher } from './saga'
import { XkcdAwareState } from './state'

export const getXkcdModule = (): ISagaModule<XkcdAwareState, XkcdActionsUnion> => {
  return {
    id: XKCD_MODULE_NAME,
    reducerMap: {
      [XKCD_MODULE_NAME]: xkcdReducer,
    },
    sagas: [loadXkcdInfoWatcher],
    retained: true,
  }
}
