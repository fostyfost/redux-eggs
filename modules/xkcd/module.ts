import { xkcdReducer } from './reducer'
import { XKCD_MODULE_NAME } from './index'
import { loadXkcdInfoWatcher } from './saga'
import { XkcdActionsUnion } from './action-creators'
import { ISagaModule } from '../../store/saga-extension/contracts'
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
